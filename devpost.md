# VidAssembly

Tired of sitting through long and boring videos? Say hello to VidAssembly! 👋

Our cutting-edge deep learning technology powered by `Assembly AI` will revolutionize the way you consume video content. With VidAssembly, you can turn any long, boring video into bite-sized, engaging content.

Whether it's a one hour lecture or a 30-minute zoom meeting, VidAssembly can transcribe, summarise, detect and extract the important slides and keywords from the video, and even translate the content into other languages.

Say goodbye to boredom and hello to a better way to watch videos with VidAssembly!

## 💡 Inspiration

When we first began looking into the topic of AI, we were filled with excitement at the many potential areas we could explore. From mobility to healthcare, media and entertainment, agriculture, social issues, and sustainability, there seemed to be no shortage of potential avenues to pursue. However, despite spending hours trying to find something that truly inspired us, we struggled to come up with anything that truly grabbed our attention.

It wasn't until we returned to our roots as students that we finally found the spark of inspiration we had been seeking. With the world's push towards digitalisation, online recorded lectures and meetings are becoming more and more common. But for many of us, these videos can be difficult to understand. Some people speak in non-native languages, while others have accents that are hard to decipher. And even when the speaker is speaking in a familiar language, the lack of accompanying slides can make it hard to follow along.

These challenges are only compounded by the fact that the average audience attention span is just seven minutes, and that current transcription tools like Zoom aren't always accurate. As a result, we often found ourselves struggling to properly understand video content, which was frustrating and disheartening.

But it was this frustration that ultimately inspired us to build a project that would help us, and others like us, extract video information more efficiently. By leveraging AI and machine learning, we hope to create a tool that can accurately transcribe lectures and meetings, making it easier for students and professionals alike to understand and retain the information being presented.

We're still in the early stages of development, but we're excited about the potential impact our project could have. By making online video content more accessible and engaging, we hope to help individuals and organizations in taking full advantage of the digital realm.

## 🤖 What it does

Be it a one hour long lecture, or a 30-minute zoom meeting, ByteVid can do:

- Transcription
- Key phrase extraction
- Summarisation
- Key slides detection and extraction
- Translation
- Speakers detection

## 🛠️ How we built it

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

## 🪨 Challenges we ran into

- There is no existing solution for lecture slides detection, so we manually labelled hundreds of videos and images and successfully trained our own lecture slides detection model
- Our GPU machine has no Internet access, so we set up a relay server with autossh port forwarding
- The ffmpeg commands were complicated, but we succeeded in understanding them and felt a sense of accomplishment.
- We observed that speakers in the videos typically spoke slowly, so we optimized transcription performance by speeding up the videos by 1.6x before using the Assembly AI speech recognition API.
- We exceeded our Baidu translation API free quota during testing, so we paid $10 to purchase additional quota.
- The Baidu translation API has a rate limit, so we split paragraphs into chunks of sentences and request translations at a moderate speed.

## 🏆 Accomplishments that we’re proud of

- Building and deploying a fully functional AI product in less than 2 days
- Our products are a combination of three exciting fields of AI: computer vision, natural language processing and speech processing
- We build our own lecture slides dataset and CV model that is better than existing solutions

## 🎯 What’s next for `VidAssembly`

- Increase support for other URLs other than YouTube
- Scale the backend to serve more requests at the same time
- Implement a Telegram/Discord bot for easier access to our services
