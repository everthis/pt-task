require("dotenv").config();
const path = require("path");
const bull = require("bull");
const ffmpeg = require("fluent-ffmpeg");
const setTaskLog = require("./util/setTaskLog");
const { REDIS_HOST_PORT } = process.env;
function exec(fpath) {
  const extname = path.extname(fpath);
  const mp4FilePath = `/home/everthis/${path.basename(fpath, extname)}.mp4`;
  const opts = `-vf subtitles=${fpath}`;
  console.log(opts);
  return new Promise((reslove, reject) => {
    new ffmpeg(fpath)
      .videoBitrate("2500k")
      .videoCodec("libx264")
      .size("?x720")
      .audioCodec("libfdk_aac")
      .audioBitrate("128k")
      .format("mp4")
      .outputOptions([opts])
      .on("stderr", function(stderrLine) {
        console.log("Stderr output: " + stderrLine);
      })
      .on("error", err => {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .on("progress", async progress => {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", async res => {
        console.log("Processing finished !");
        const payload = {
          step: "convert",
          log: {
            progress: 100,
            fpath: mp4FilePath
          }
        };

        reslove(payload);
      })
      .save(mp4FilePath);
  });
}

exec(
  "/home/everthis/Detective.Conan.Zero.the.Enforcer.2018.720p.Blu-ray.DD5.1.x264-PuTao/Detective.Conan.Zero.the.Enforcer.2018.720p.Blu-ray.DD5.1.x264-PuTao.mkv"
).catch(err => console.log(err));
