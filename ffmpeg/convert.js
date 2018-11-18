require("dotenv").config();
const path = require("path");
const fs = require("fs");
const bull = require("bull");
const ffmpeg = require("fluent-ffmpeg");
const setTaskLog = require("../util/setTaskLog");
const { REDIS_HOST_PORT } = process.env;
const convertQueue = new bull("convert", REDIS_HOST_PORT);

convertQueue.process(async job => {
  const { fpath, hash } = job.data;
  const startTs = new Date().getTime();
  const extname = path.extname(fpath);
  const mp4FilePath = `/home/everthis/projects/pt-task/public/downloads/${path.basename(
    fpath,
    extname
  )}.mp4`;
  const subResult = await hasEmbeddedSubCheck(fpath);
  console.log(subResult);
  const subtitleOptions = subOption(subResult, fpath);

  console.log(subtitleOptions);

  return new Promise((reslove, reject) => {
    composeFfmpegProcess(
      subtitleOptions,
      reslove,
      reject,
      fpath,
      hash,
      startTs,
      mp4FilePath
    );
  });
});

function composeFfmpegProcess(
  cmd,
  reslove,
  reject,
  fpath,
  hash,
  startTs,
  mp4FilePath
) {
  const instance = new ffmpeg(fpath)
    .videoBitrate("2500k")
    .videoCodec("libx264")
    .audioCodec("libfdk_aac")
    .audioBitrate("128k");
  if (cmd.output && cmd.output.length > 0) {
    instance.outputOptions(...cmd.output);
  }
  if (cmd.complex && cmd.complex.length > 0) {
    instance.complexFilter(...cmd.complex);
  }
  instance
    .on("start", commandLine => {
      console.log("Ffmpeg starting conversion with command: " + commandLine);
    })
    .on("stderr", stderrLine => {
      console.log("Stderr output: " + stderrLine);
    })
    .on("error", err => {
      console.log("An error occurred: " + err.message);
      reject(err);
    })
    .on("progress", async progress => {
      console.log("Processing: " + progress.percent + "% done");
      await setTaskLog({
        hash,
        step: "convert",
        log: {
          start_ts: startTs,
          progress: progress.percent,
          end_ts: new Date().getTime()
        }
      });
    })
    .on("end", async res => {
      console.log("Processing finished !");
      const payload = {
        hash,
        step: "convert",
        log: {
          start_ts: startTs,
          progress: 100,
          fpath: mp4FilePath,
          end_ts: new Date().getTime()
        }
      };
      await setTaskLog(payload);
      fs.unlinkSync(fpath);
      reslove(payload);
    })
    .save(mp4FilePath);
  return instance;
}

function subOption(res = {}, fpath) {
  const p = fpath.replace(/[\s\']/g, arg => {
    return "\\\\\\" + arg;
  });
  if (res.subType == null) {
    return {
      output: ["-map", "[output]", "-map", "0:a"],
      complex: [
        [
          `[0:v]scale='min(1280,iw)':min'(720,ih)':force_original_aspect_ratio=decrease[output]`
        ]
      ]
    };
  }
  if (res.subType.indexOf("ass") !== -1) {
    return {
      output: ["-map", "[output]", "-map", "0:a"],
      complex: [
        [
          `[0:v]scale='min(1280,iw)':min'(720,ih)':force_original_aspect_ratio=decrease[scaled]`,
          {
            filter: "subtitles",
            options: { f: p, si: res.subIdx },
            inputs: ["scaled"],
            outputs: "output"
          }
        ]
      ]
    };
  } else {
    return {
      output: ["-map", "[output]", "-map", "0:a"],
      complex: [
        [
          `[0:v]scale='min(1280,iw)':min'(720,ih)':force_original_aspect_ratio=decrease[scaled]`,
          `[scaled][0:s:${res.subIdx}]overlay[output]`
        ]
      ]
    };
  }
}

function hasEmbeddedSubCheck(fpath) {
  const targetSubTagLang = ["chi"];
  const targetSubTagTitle = [
    "简",
    "繁",
    "chs",
    "CHS",
    "Chs",
    "CHT",
    "Cht",
    "cht"
  ];
  return new Promise((reslove, reject) => {
    ffmpeg.ffprobe(fpath, (err, metadata) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      const { streams } = metadata;
      const result = {};
      const subtitlesArr = [];
      for (let i = 0; i < streams.length; i++) {
        if (streams[i].codec_type === "subtitle") {
          if (!result.hasEmbeddedSub) {
            result.hasEmbeddedSub = true;
            result.subIdx = 0;
            result.subType = streams[i].codec_name;
          }
          subtitlesArr.push(streams[i]);
        }
      }

      for (let j = 0; j < targetSubTagTitle.length; j++) {
        let title = targetSubTagTitle[j];
        for (let k = 0; k < subtitlesArr.length; k++) {
          let stream = subtitlesArr[k];
          if (stream.tags.title && stream.tags.title.indexOf(title) !== -1) {
            result.subIdx = k;
            result.subType = stream.codec_name;
            reslove(result);
            return;
          }
        }
      }
      reslove(result);
    });
  });
}

function convertFn({ fpath, hash }) {
  const p = decodeURIComponent(fpath);
  return convertQueue.add({ fpath: p, hash });
}
module.exports = { convertFn };
