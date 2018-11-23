require("dotenv").config();
const path = require("path");
const bull = require("bull");
const ffmpeg = require("fluent-ffmpeg");
const setTaskLog = require("./util/setTaskLog");
const { REDIS_HOST_PORT } = process.env;

function exec(fpath) {
  const extname = path.extname(fpath);
  const mp4FilePath = `/home/everthis/${path.basename(fpath, extname)}.mp4`;
  return new Promise((reslove, reject) => {
    ffmpeg.ffprobe(fpath, function(err, metadata) {
      console.log(JSON.stringify(metadata, null, 2));
    });
  });
}

exec(
  "/mnt/wd8t/Ferdinand.2017.BluRay.720p.x264.DTS-HDChina/Ferdinand.2017.BluRay.720p.x264.DTS-HDChina.mkv"
).catch(err => console.log(err));
