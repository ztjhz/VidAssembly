import os

import requests
from dotenv import load_dotenv
from typing import Tuple

load_dotenv()

API_KEY = os.environ['API_KEY']
endpoint = "https://api.assemblyai.com/v2/transcript"

config = {
    "auto_highlights": True,
    "auto_chapters": True,
}

headers = {"authorization": API_KEY, "content-type": "application/json"}


def send(audio_url: str) -> Tuple[bool, str]:
    """Returns success_status (bool) and transcript_id (str)"""
    try:
        response = requests.post(endpoint,
                                 json={
                                     **config, "audio_url": audio_url
                                 },
                                 headers=headers)
        res = response.json()
        return True, res['id']
    except Exception as e:
        print(e)
        return False, 'error'


def get_result(transcript_id: str):
    response = requests.get(f"{endpoint}/{transcript_id}", headers=headers)
    res = response.json()
    return res


def get_sentences(transcript_id: str):
    response = requests.get(f"{endpoint}/{transcript_id}/sentences",
                            headers=headers)
    res = response.json()
    return res


def get_srt(transcript_id: str):
    response = requests.get(f"{endpoint}/{transcript_id}/srt", headers=headers)
    res = response.text
    return res


def upload_file(filename: str) -> str:
    """Upload local file to Assembly AI and returns the file url (str)"""
    data = None
    with open(filename, 'rb') as f:
        data = f.read()

    response = requests.post('https://api.assemblyai.com/v2/upload',
                             headers=headers,
                             data=data)

    return response.json()['upload_url']
