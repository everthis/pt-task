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
  bucket: ENV.ALI_OSS_BUCKET,
  secure: true
});

async function progress(percent, checkpoint, res) {
  console.log("precent:", percent);
  console.log("checkpoint:", checkpoint);
}
async function multipartUpload(fpath) {
  const fileName = path.basename(fpath);
  try {
    let result = await client.multipartUpload(fileName, fpath, {
      partSize: 10 * 1024 * 1024,
      progress,
      meta: {}
    });
    console.log(result);
    let head = await client.head("object-name");
    console.log(head);
  } catch (e) {
    // 捕获超时异常
    if (e.code === "ConnectionTimeoutError") {
      console.log("Woops,超时啦!");
      // do ConnectionTimeoutError operation
    }
    console.log(e);
  }
}

multipartUpload("");
