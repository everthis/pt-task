const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

function convertFn(fpath) {
  return new ffmpeg(path)
    .videoBitrate("2500k")
    .videoCodec("libx264")
    .size("?x720")
    .audioCodec("libfaac")
    .audioBitrate("128k")
    .on("error", function(err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function() {
      console.log("Processing finished !");
    })
    .save(
      `/home/everthis/projects/pt-task/public/downloads/${path.basename(fpath)}`
    );
}
module.exports = { convertFn };
