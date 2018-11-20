require("dotenv").config();
const path = require("path");
const bull = require("bull");
const ffmpeg = require("fluent-ffmpeg");
const setTaskLog = require("./util/setTaskLog");
const { REDIS_HOST_PORT } = process.env;
async function exec(fpath) {
  const startTs = new Date().getTime();
  const extname = path.extname(fpath);
  const mp4FilePath = `/home/everthis/projects/pt-task/public/downloads/${path.basename(
    fpath,
    extname
  )}.mp4`;
  const subResult = await hasEmbeddedSub(fpath);
  console.log(subResult);
  const subtitleOptions = subOption(subResult, fpath);

  console.log(subtitleOptions);

  return new Promise((reslove, reject) => {
    composeFfmpegProcess(
      subtitleOptions,
      reslove,
      reject,
      fpath,
      startTs,
      mp4FilePath
    );
  });
}

function composeFfmpegProcess(
  cmd,
  reslove,
  reject,
  fpath,
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
      // console.log("Stderr output: " + stderrLine);
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
          start_ts: startTs,
          progress: 100,
          fpath: mp4FilePath,
          end_ts: new Date().getTime()
        }
      };
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
  if (!res.hasEmbeddedSub) {
    return {
      size: "",
      output: [],
      complex: []
    };
  } else if (res.subType.indexOf("pgs") !== -1) {
    return {
      size: "",
      output: ["-map [output]", "-map 0:a"],
      complex: [
        [
          `[0:v]scale='min(1280,iw)':min'(720,ih)':force_original_aspect_ratio=decrease[scaled]`,
          `[scaled][0:s:${res.subIdx}]overlay[output]`
        ]
      ]
    };
  } else {
    return {
      size: "",
      output: [`-vf subtitles=${fpath}:si=${res.subIdx}`],
      complex: []
    };
  }
}

function hasEmbeddedSub(fpath) {
  const targetSubTagLang = ["chi"];
  const targetSubTagTitle = ["简", "繁", "chs", "CHS", "Chs", "CHT", "cht"];
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

//ass;
// exec(
//   "/mnt/wd8t/The.Incredibles.2.2018.720p.BluRay.x264-WiKi/The.Incredibles.2.2018.720p.BluRay.x264-WiKi.mkv"
// ).catch(err => console.log(err));

// pgs
// exec(
//   "/mnt/wd8t/Hotel.Desire.2011.720p.BluRay.x264.DTS-HDChina/Hotel.Desire.2011.720p.BluRay.x264.DTS-HDChina.mkv"
// ).catch(err => console.log(err));

// ass
exec(
  "/mnt/wd8t/Hotel.Transylvania.3.Summer.Vacation.2018.BluRay.720p.x264.DTS-HDChina/Hotel.Transylvania.3.Summer.Vacation.2018.BluRay.720p.x264.DTS-HDChina.mkv"
).catch(err => console.log(err));

// no sub
// exec(
//   "/mnt/wd8t/Young.Mother.2013.720p.HDRip.H264.AC3.Hyd/Young.Mother.2013.720p.HDRip.H264.AC3.Hyd.mkv"
// ).catch(err => console.log(err));
