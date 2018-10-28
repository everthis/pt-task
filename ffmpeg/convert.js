const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

function convertFn(fpath) {
  const extname = path.extname(fpath);
  return new ffmpeg(fpath)
    .videoBitrate("2500k")
    .videoCodec("libx264")
    .size("?x720")
    .audioCodec("libmp3lame")
    .audioBitrate("128k")
    .on("error", function(err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function() {
      console.log("Processing finished !");
    })
    .save(
      `/home/everthis/projects/pt-task/public/downloads/${path.basename(
        fpath,
        extname
      )}.mp4`
    );
}
module.exports = { convertFn };
