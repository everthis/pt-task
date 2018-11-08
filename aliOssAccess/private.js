require("dotenv").config();
const OSS = require("ali-oss");
const path = require("path");
const {
  ALI_OSS_REGION,
  ALI_OSS_ACCESS_KEY_ID,
  ALI_OSS_ACCESS_KEY_SECRET,
  ALI_OSS_BUCKET
} = process.env;

const client = new OSS({
  region: ALI_OSS_REGION,
  accessKeyId: ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: ALI_OSS_ACCESS_KEY_SECRET,
  bucket: ALI_OSS_BUCKET,
  secure: true
});

async function bucketACL() {
  try {
    const result = await client.getBucketACL(ALI_OSS_BUCKET);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

function getSignUrl(
  fname,
  options = {
    expires: 1800 * 5
  }
) {
  const fileName = path.basename(fname);
  return client.signatureUrl(fileName, options);
}

module.exports = {
  client,
  getSignUrl,
  bucketACL
};
