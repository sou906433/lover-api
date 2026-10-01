const express = require('express');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.get('/', (req, res) => {
  res.json({ owner: "LOVER", status: "API Running" });
});

// গান সার্চ + ডাউনলোড লিঙ্ক দেবে
app.get('/play', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ error: "গানের নাম লেখো?q=arijit singh" });

    const search = await yts(q);
    const video = search.videos[0];

    // ডাইরেক্ট mp3 লিঙ্ক বের করা
    const info = await ytdl.getInfo(video.url);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const bestAudio = audioFormats[0];

    res.json({
      creator: "LOVER",
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.timestamp,
      videoId: video.videoId,
      url: video.url,
      download: bestAudio.url // এটাই তোমার mp3 লিঙ্ক
    });

  } catch (e) {
    res.json({ error: "API Error", msg: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("LOVER API STARTED"));
