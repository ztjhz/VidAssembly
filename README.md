<h2 align="center"><b>VidAssembly</b></h2>

<p align="center">
<img src="public/icon.png" alt="vidassembly" width="100" />
</p>

<h4 align="center"><b>Transcribe, Summarise, Translate, Analyse Speakers, Extract Keywords and Slides</b></h4>

<p align="center">
<a href="https://github.com/ztjhz/VidAssembly/blob/master/LICENSE" target="blank">
<img src="https://img.shields.io/github/license/ztjhz/VidAssembly?style=flat-square" alt="licence" />
</a>
<a href="https://github.com/ztjhz/VidAssembly/fork" target="blank">
<img src="https://img.shields.io/github/forks/ztjhz/VidAssembly?style=flat-square" alt="forks"/>
</a>
<a href="https://github.com/ztjhz/VidAssembly/stargazers" target="blank">
<img src="https://img.shields.io/github/stars/ztjhz/VidAssembly?style=flat-square" alt="stars"/>
</a>
<a href="https://github.com/ztjhz/VidAssembly/issues" target="blank">
<img src="https://img.shields.io/github/issues/ztjhz/VidAssembly?style=flat-square" alt="issues"/>
</a>
<a href="https://github.com/ztjhz/VidAssembly/pulls" target="blank">
<img src="https://img.shields.io/github/issues-pr/ztjhz/VidAssembly?style=flat-square" alt="pull-requests"/>
</a>
<a href="https://twitter.com/intent/tweet?text=๐%20Check%20this%20amazing%20repo%20https://github.com/ztjhz/VidAssembly,%20created%20by%20@nikushii_"><img src="https://img.shields.io/twitter/url?label=Share%20on%20Twitter&style=social&url=https%3A%2F%2Fgithub.com%ztjhz%2FVidAssembly"></a>
</p>

<p align="center">
    <a href="https://vidassembly.tjh.sg">View Demo</a>
    ยท
    <a href="https://github.com/ztjhz/VidAssembly/issues/new/choose">Report Bug</a>
    ยท
    <a href="https://github.com/ztjhz/VidAssembly/issues/new/choose">Request Feature</a>
</p>

## ๐๐ป Introducing `VidAssembly`

<p align="center">
    <a href="https://vidassembly.tjh.sg" target="_blank">
        <img src="public/landing.jpg" alt="landing" width=800 />
    </a>
</p>

Tired of sitting through long and boring videos? Say hello to `VidAssembly`! ๐

Our cutting-edge deep learning technology powered by `Assembly AI` will revolutionize the way you consume video content. With `VidAssembly`, you can turn any long, boring video into bite-sized, engaging content.

Whether it's a one hour lecture or a 30-minute zoom meeting, `VidAssembly` can transcribe, summarise, detect and extract the important slides and keywords from the video, and even translate the content into other languages.

Say goodbye to boredom and hello to a better way to watch videos with `VidAssembly`!

## ๐ Demo

Here is a quick demo of the app. We hope you enjoy it.

> [The Demo Link](https://vidassembly.tjh.sg)

Liked it? Please give a โญ๏ธ to **VidAssembly**.

## ๐ฅ Features

`VidAssembly` comes with a bundle of features already. You can do the followings with it,

- ๐ Transcribe videos using speech recognition
- ๐ Summarise content into short insightful pieces
- ๐ Translate transcript to over 20 languages
- ๐ฌ Analyse speakers during
- โ Extract important keywords from the video
- ๐ผ๏ธ Extract important slides from the video

## ๐๏ธ App Architecture

<p align="center">
    <img src="public/diagram.png" alt="diagram" />
</p>

### Frontend

- React.js
- Tailwind CSS
- Deploy on GitHub pages

### Backend

- Flask server
- Deploy on a GPU machine
- Relay to an Internet-facing VPS
- Nginx reverse proxy
- Cloudflare protection

### Artificial Intelligence

- [Assembly AI](https://www.assemblyai.com/)
- YOLOv7

### Tools

- OpenCV
- yt-dlp
- ffmpeg

## ๐๏ธ Setting up `VidAssembly` for Backend Development

The application requires the command-line tool `ffmpeg` to be installed on your system, which is available from most package managers:

#### on Ubuntu or Debian

```sh
sudo apt update && sudo apt install ffmpeg
```

#### on Arch Linux

```sh
sudo pacman -S ffmpeg
```

#### on MacOS using Homebrew (https://brew.sh/)

```sh
brew install ffmpeg
```

#### on Windows using Chocolatey (https://chocolatey.org/)

```sh
choco install ffmpeg
```

#### on Windows using Scoop (https://scoop.sh/)

```sh
scoop install ffmpeg
```

### Develop

```sh
## create an virtual environment
python3.10 -m venv venv
. ./venv/bin/activate

## install packages
pip install -U pip
pip install -U wheel
pip install -r requirements.txt

## download model weights
wget https://github.com/ztjhz/yolov7-slides-extraction/releases/download/v1.0/best.pt

## set API access key
export BAIDU_APP_ID=_BAIDU_APP_ID
export BAIDU_APP_KEY=_BAIDU_APP_KEY
export API_KEY=_ASSEMBLY_AI_API_KEY

## start the server
flask --app app run
```

### Deploy

```sh
waitress-serve --host 127.0.0.1 --port 31346 app:app
```
