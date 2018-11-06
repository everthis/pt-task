require("dotenv").config();
const OSS = require("ali-oss");
const path = require("path");
const setTaskLog = require("../util/setTaskLog");
const ENV = process.env;
const client = new OSS({
  region: ENV.ALI_OSS_REGION,
  accessKeyId: ENV.ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: ENV.ALI_OSS_ACCESS_KEY_SECRET,
  bucket: ENV.ALI_OSS_BUCKET
});

let checkpoint;

function setUploadProgress({ hash, percentage }) {
  return setTaskLog({
    hash,
    step: "upload",
    log: {
      progress: percentage
    }
  });
}
async function aliUpload({ hash, filePath }) {
  const fileName = path.basename(filePath);
  // retry 5 times
  for (let i = 0; i < 5; i++) {
    try {
      const result = await client.multipartUpload(fileName, filePath, {
        checkpoint,
        async progress(percentage, cpt) {
          await setUploadProgress({
            hash,
            percentage
          });
          console.log(percentage);
          checkpoint = cpt;
        }
      });
      await setUploadProgress({
        hash,
        percentage: 1
      });
      console.log(result);
      break; // break if success
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = { aliUpload };
