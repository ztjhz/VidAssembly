import os
import re

import yt_dlp


def allowed_file(filename: str) -> bool:
    ALLOWED_EXTENSIONS = {'mp4', 'mp3', 'mkv'}
    return '.' in filename and get_extension(filename) in ALLOWED_EXTENSIONS


def get_extension(filename: str) -> str:
    return filename.rsplit('.', 1)[1].lower()


def validate_youtube_url(url: str) -> bool:
    expr = "^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$"
    match = re.match(expr, url)
    if not match or not match[4]: return False
    return True


def download_youtube_video(url: str, uuid: str, work_dir: str) -> None:
    ydl_opts = {'outtmpl': os.path.join(work_dir, uuid, 'video.%(ext)s')}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


def extract_keyphrase(res):
    """Returns (keyphrase (str), rank (float), count (int))"""
    return list(
        map(lambda x: (x['text'], x['rank'], x['count']),
            res['auto_highlights_result']['results']))


def extract_summaries(res):
    """Returns summaries"""
    return res['chapters']


def extract_speaker_percentage(res):
    speaker_total = {}
    total_duration = res['audio_duration'] * 1000  # convert to milliseconds
    for speaker_data in res['utterances']:
        speaker = speaker_data['speaker']
        start = speaker_data['start']
        end = speaker_data['end']
        speaker_total[speaker] = speaker_total.get(speaker, 0) + end - start

    speaker_percentage = {}
    for speaker, total in speaker_total.items():
        speaker_percentage[speaker] = min(total / total_duration, 1)

    return speaker_percentage
