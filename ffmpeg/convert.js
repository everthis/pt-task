const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const setTaskLog = require("../util/setTaskLog");

function convertFn({ fpath, hash }) {
  const extname = path.extname(fpath);
  return new ffmpeg(fpath)
    .videoBitrate("2500k")
    .videoCodec("libx264")
    .size("?x720")
    .audioCodec("libfdk_aac")
    .audioBitrate("128k")
    .on("error", function(err) {
      console.log("An error occurred: " + err.message);
    })
    .on("progress", async progress => {
      console.log("Processing: " + progress.percent + "% done");
      await setTaskLog({
        hash,
        step: "convert",
        log: {
          progress: progress.percent
        }
      });
    })
    .on("end", async res => {
      console.log("Processing finished !");
      await setTaskLog({
        hash,
        step: "convert",
        log: {
          progress: 100
        }
      });
    })
    .save(
      `/home/everthis/projects/pt-task/public/downloads/${path.basename(
        fpath,
        extname
      )}.mp4`
    );
}
module.exports = { convertFn };
