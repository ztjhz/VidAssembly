import os
import re
import sqlite3
import traceback
from concurrent.futures import ThreadPoolExecutor
from glob import glob
from typing import Optional
from uuid import uuid4

from flask import Flask, jsonify, request
from flask_cors import CORS

from lib.api import get_result, get_srt, send, upload_file
from lib.keyframe_determination import determine_keyframes
from lib.slides_dectection import extract_slides
from lib.translation import translate
from lib.utils import (allowed_file, download_youtube_video, extract_keyphrase,
                       extract_summaries, get_extension, validate_youtube_url)
from lib.video_preprocessing import speedup_1_6x

VIDEO_FOLDER = 'workdir'

app = Flask(__name__, static_url_path='/static', static_folder='workdir')
CORS(app)
app.config['work_dir'] = VIDEO_FOLDER

if not os.path.exists(app.config["work_dir"]):
    os.mkdir(app.config["work_dir"])

executor = ThreadPoolExecutor(4)

# initialise database
conn = sqlite3.connect('database.db')
conn.executescript("""
            CREATE TABLE IF NOT EXISTS results (
                uuid TEXT PRIMARY KEY,
                api_id TEXT,
                transcript TEXT,
                translated TEXT,
                error_message TEXT,
                status INTEGER
            );
            CREATE TABLE IF NOT EXISTS keywords (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL,
                keyword TEXT NOT NULL,
                rank REAL NOT NULL,
                count INTEGER NOT NULL,
                FOREIGN KEY (uuid) REFERENCES results
            );
            CREATE TABLE IF NOT EXISTS summaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL,
                text TEXT NOT NULL,
                gist TEXT NOT NULL,
                headline TEXT NOT NULL,
                image TEXT,
                original_image TEXT,
                FOREIGN KEY (uuid) REFERENCES results
            );
            """)
conn.close()


@app.route("/result/<uuid>", methods=["GET"])
def result(uuid):
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()

    result = {}

    # get transcript, translated, and status
    res = cur.execute("SELECT * from results WHERE uuid = ?",
                      (uuid, )).fetchone()

    if not res:
        return jsonify({"status": -1})

    _, api_id, transcript, translated, error_message, status = res

    result["transcript"] = transcript
    result["translated"] = translated
    result["status"] = status
    result["error_message"] = error_message

    # get summaries
    res = cur.execute("SELECT * from summaries WHERE uuid = ?",
                      (uuid, )).fetchall()

    if len(res) != 0:
        result["summaries"] = []
        for row in res:
            result["summaries"].append({})
            result["summaries"][-1]["text"] = row[2]
            result["summaries"][-1]["gist"] = row[3]
            result["summaries"][-1]["headline"] = row[4]
            result["summaries"][-1]["image"] = row[5]
            result["summaries"][-1]["original_image"] = row[6]

    # get keywords
    res = cur.execute("SELECT * from keywords WHERE uuid = ?",
                      (uuid, )).fetchall()

    if len(res) != 0:
        result["keywords"] = []
        for row in res:
            result["keywords"].append(row[2])

    return jsonify(result), 200


@app.route("/video", methods=["POST"])
def video():
    if request.method == "POST":
        video_type = request.form.get("type")
        video_file = request.files.get("file")
        url = request.form.get("url")
        video_language = request.form.get("videoLanguage")
        translate_language = request.form.get("translateLanguage")

        print(video_type, video_language, translate_language)

        if not video_type or video_language is None or translate_language is None:
            return "Incomplete form!", 400

        curr_uuid = str(uuid4())

        if video_type == "upload":
            if not video_file:
                return 'No file part', 400
            elif video_file.filename == '':
                return 'No selected file', 400
            elif not allowed_file(video_file.filename):
                return 'file extension not allowed!', 400

            save_dir = os.path.join(app.config['work_dir'], curr_uuid)
            save_path = os.path.join(
                save_dir, "video." + get_extension(video_file.filename))
            if not os.path.exists(save_dir):
                os.mkdir(save_dir)
            video_file.save(save_path)

            executor.submit(begin, curr_uuid, video_type, None, video_language,
                            translate_language)
        elif video_type == "youtube":
            if (not validate_youtube_url(url)):
                return "YouTube url invalid", 400
            executor.submit(begin, curr_uuid, video_type, url, video_language,
                            translate_language)

        return curr_uuid, 202
    else:
        return "Only POST request accepted!", 405


def begin(uuid: str, video_type: str, url: Optional[str], language_src: str,
          language_dst: str) -> None:
    if not language_src:
        language_src = None
    if not language_dst:
        language_dst = None

    conn = sqlite3.connect('database.db')
    cur = conn.cursor()

    cur.execute("INSERT INTO results (uuid, status) VALUES (?, ?)", (uuid, 0))
    conn.commit()

    try:
        # download video
        if video_type == 'youtube':
            download_youtube_video(url, uuid, app.config['work_dir'])

        work_dir = os.path.join(app.config['work_dir'], uuid)
        if not os.path.exists(work_dir):
            print(f"Folder {uuid} not found!")
            raise OSError(f"Folder {uuid} not found!")

        # preprocess and upload video
        filename_preprocessed = speedup_1_6x(work_dir)
        url = upload_file(os.path.join(work_dir, filename_preprocessed))

        cur.execute("UPDATE results set status = ? WHERE uuid = ?", (1, uuid))
        conn.commit()
        print("Video uploaded")

        # Send to Assembly AI API
        success, transcript_id = send(url)
        if not success:
            raise Exception("Failed to send to api")

        cur.execute("UPDATE results set api_id = ? WHERE uuid = ?",
                    (transcript_id, uuid))
        conn.commit()
        print("API success")

        # poll for results
        res = get_result(transcript_id)
        while res['status'] != 'completed' and res['status'] != 'error':
            res = get_result(transcript_id)
            print(transcript_id, res['status'])

        # generate transcript
        transcript = get_srt(transcript_id)
        cur.execute(
            "UPDATE results set status = ?, transcript = ? WHERE uuid = ?",
            (2, transcript, uuid))
        conn.commit()
        print("Transcription done")

        # extract key phrases
        keyphrases = extract_keyphrase(res)

        for keyphrase, rank, count in keyphrases:
            cur.execute(
                "INSERT INTO keywords (uuid, keyword, rank, count) VALUES (?, ?, ?, ?)",
                (uuid, keyphrase, rank, count))
        cur.execute("UPDATE results set status = ? WHERE uuid = ?", (3, uuid))
        conn.commit()
        print("Keyphrases extracted")

        # extract summary
        summaries = extract_summaries(res)

        cur.execute("UPDATE results set status = ? WHERE uuid = ?", (4, uuid))
        conn.commit()
        print("Summarised")

        # extract slides image
        keyframe_paths = determine_keyframes(work_dir, summaries)
        extracted_paths = extract_slides(work_dir, keyframe_paths)

        for index, path in enumerate(extracted_paths):
            cur.execute(
                "INSERT INTO summaries (uuid, text, gist, headline, image, original_image) VALUES (?, ?, ?, ?, ?, ?)",
                (uuid, summaries[index]['summary'], summaries[index]['gist'],
                 summaries[index]['headline'], path, keyframe_paths[index]))

        cur.execute("UPDATE results set status = ? WHERE uuid = ?", (5, uuid))
        conn.commit()
        print("Key slides extracted")

        # remove videos
        os.remove(glob(os.path.join(work_dir, 'video.*'))[0])
        os.remove(glob(os.path.join(work_dir, 'preprocessed.*'))[0])
        print("Video files removed")

        text_translated = ''
        if language_dst is None:
            text_translated = ''
        else:
            text_translated = translate(res['text'],
                                        src=language_src,
                                        dst=language_dst)

        cur.execute(
            "UPDATE results set status = ?, translated = ? WHERE uuid = ?",
            (200, text_translated, uuid))
        conn.commit()
        print("Translation complete")
    except Exception as e:
        print(traceback.format_exc())
        cur.execute(
            "UPDATE results set status = ?, error_message = ? WHERE uuid = ?",
            (500, repr(e), uuid))
        conn.commit()

    print("All processing done")