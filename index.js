const express = require('express');
const yts = require('yt-search');
const play = require('play-dl');
const app = express();

// play-dl init - 429 fix এর জন্য জরুরি
play.getFreeClientID();
play.setToken({
  youtube : {
    cookie : process.env.YT_COOKIE || ""
  }
});

app.get('/', (req, res) => {
  res.json({ owner: "LOVER", status: "API Running - Fixed" });
});

app.get('/play', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "গানের নাম লেখো?q=arijit" });

    const search = await yts(q);
    if (!search.videos.length) return res.json({ error: "Song Not Found" });
    const video = search.videos[0];

    let yt_info = await play.video_info(video.url);
    let stream = await play.stream_from_info(yt_info);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${video.title}.mp3"`);
    stream.stream.pipe(res);

  } catch (e) {
    console.log(e);
    res.json({ error: "API Error", msg: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("LOVER API FIXED"));
