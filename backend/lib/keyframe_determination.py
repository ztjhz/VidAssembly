from collections import namedtuple
import cv2
from glob import glob
import os
from typing import Optional

Sub = namedtuple('Sub', ('start', 'end', 'text'))


def timestamps_to_images(
        video_path: str, dir_out: str,
        timestamps: list[Optional[int]]) -> list[Optional[str]]:
    video = cv2.VideoCapture(video_path)
    assert video.isOpened()
    res = []
    for i, timestamp in enumerate(timestamps):
        if timestamp is None:
            res.append(None)
        else:
            video.set(cv2.CAP_PROP_POS_MSEC, timestamp)  # in milliseconds
            ret, frame = video.read()
            img_name = f'keyframe_{i}.png'
            path_out = os.path.join(dir_out, img_name)
            cv2.imwrite(path_out, frame)
            res.append(img_name)
    video.release()
    return res


def calculate_keyframe_timestamps(summaries):
    return [(summary['start'] + summary['end']) // 2 for summary in summaries]


def determine_keyframes(work_dir: str, summaries) -> list[Optional[str]]:
    video_file_orig = glob(os.path.join(work_dir, 'video.*'))[0]
    video_file = video_file_orig.replace('video.', 'preprocessed.')
    keyframe_timestamps = calculate_keyframe_timestamps(summaries)
    keyframe_paths = timestamps_to_images(video_file, work_dir,
                                          keyframe_timestamps)
    return keyframe_paths