require("dotenv").config();
const OSS = require("ali-oss");
const path = require("path");
const fs = require("fs");
const setTaskLog = require("./util/setTaskLog");
const ENV = process.env;
const client = new OSS({
  region: ENV.ALI_OSS_REGION,
  accessKeyId: ENV.ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: ENV.ALI_OSS_ACCESS_KEY_SECRET,
  bucket: ENV.ALI_OSS_BUCKET,
  secure: true
});

function exec(job) {
  const { hash, fpath } = job;
  let checkpoint = undefined;
  const startTs = new Date().getTime();
  return new Promise(async (resolve, reject) => {
    const fileName = path.basename(fpath);
    // retry 5 times
    for (let i = 0; i < 5; i++) {
      try {
        const result = await client.multipartUpload(fileName, fpath, {
          checkpoint,
          async progress(percentage, cpt) {
            await setUploadProgress({
              hash,
              fileName,
              start_ts: startTs,
              end_ts: new Date().getTime(),
              percentage: percentage * 100
            });
            console.log(percentage);
            checkpoint = cpt;
          }
        });
        await setUploadProgress({
          hash,
          fileName,
          start_ts: startTs,
          end_ts: new Date().getTime(),
          percentage: 100
        });
        // fs.unlinkSync(fpath);
        // await setTaskLog({
        //   hash,
        //   step: "removeConvertedFile",
        //   log: {
        //     fileName,
        //     progress: 100
        //   }
        // });
        resolve("");
        console.log(result);
        break; // break if success
      } catch (e) {
        console.log("--------upload-error-----------", e);
      }
    }
    reject("");
  });
}

function setUploadProgress({ hash, percentage, fileName, start_ts, end_ts }) {
  return "";
  return setTaskLog({
    hash,
    step: "upload",
    log: {
      fileName,
      start_ts,
      end_ts,
      progress: percentage
    }
  });
}

exec({
  hash: "ca340af3941fab7918933023e48efa72b1768e04",
  fpath:
    "/home/everthis/projects/pt-task/public/downloads/Hotel.Transylvania.3.Summer.Vacation.2018.BluRay.720p.x264.DTS-HDChina.mp4"
});
