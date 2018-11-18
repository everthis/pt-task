require("dotenv").config();
const OSS = require("ali-oss");
const path = require("path");
const fs = require("fs");
const bull = require("bull");
const { REDIS_HOST_PORT } = process.env;
const uploadQueue = new bull("upload", REDIS_HOST_PORT);
const setTaskLog = require("../util/setTaskLog");
const ENV = process.env;
const client = new OSS({
  region: ENV.ALI_OSS_REGION,
  accessKeyId: ENV.ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: ENV.ALI_OSS_ACCESS_KEY_SECRET,
  bucket: ENV.ALI_OSS_BUCKET
});

uploadQueue.process(function(job) {
  const { hash, fpath } = job.data;
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
        fs.unlinkSync(fpath);
        await setTaskLog({
          hash,
          step: "removeConvertedFile",
          log: {
            fileName,
            progress: 100
          }
        });
        resolve("");
        console.log(result);
        break; // break if success
      } catch (e) {
        console.log("--------upload-error-----------", e);
      }
    }
    reject("");
  });
});

function setUploadProgress({ hash, percentage, fileName, start_ts, end_ts }) {
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
async function aliUpload({ hash, fpath }) {
  const p = decodeURIComponent(fpath);
  return uploadQueue.add({ hash, fpath: p });
}

module.exports = { aliUpload };
