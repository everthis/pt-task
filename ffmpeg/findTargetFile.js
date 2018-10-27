const fs = require("fs");
const path = require("path");
const checkTorrentProgress = require("../transmission/checkTorrentProgress");
const { walk, isDir } = require("../util/fsUtil");

async function findTargetFile(hash) {
  const info = await checkTorrentProgress({
    request: {
      query: {
        hash
      }
    }
  });
  const fp = path.join(info.download_dir, info.name);
  const fileArr = [];
  if (isDir(fp)) {
    fileArr.push(...(await walk(fp)));
  } else {
    fileArr.push(fp);
  }
  const targetFile = fileArr.sort((a, b) => {
    return fs.statSync(a) - fs.statSync(b);
  })[0];
  return targetFile;
}

module.exports = {
  findTargetFile
};
