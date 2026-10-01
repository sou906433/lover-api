const express = require('express');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.get('/', (req, res) => {
  res.json({ owner: "LOVER", status: "API Running" });
});

app.get('/play', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ error: "q দাও" });

    const search = await yts(q);
    const video = search.videos[0];
    if (!video) return res.json({ error: "Not Found" });

    const info = await ytdl.getInfo(video.url, {
      playerClients: ["ANDROID"]
    });

    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

    res.json({
      title: video.title,
      thumbnail: video.thumbnail,
      download: format.url,
      url: video.url
    });

  } catch (e) {
    console.error(e);
    res.json({ error: "API Error", msg: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("LOVER API OK"));
