const fs = require("fs");
const path = require("path");
const checkTorrentProgress = require("../transmission/checkTorrentProgress");
const { walk, isDir } = require("../util/fsUtil");
const setTaskLog = require("../util/setTaskLog");

async function findTargetFile(hash) {
  const payload =
    typeof hash === "object"
      ? hash
      : {
          request: {
            query: {
              hash
            }
          }
        };
  const info = await checkTorrentProgress(payload);
  const fp = path.join(info.download_dir, info.name);
  const fileArr = [];
  if (isDir(fp)) {
    fileArr.push(...(await walk(fp)));
  } else {
    fileArr.push(fp);
  }
  let targetFile = fileArr.sort((a, b) => {
    return fs.statSync(b).size - fs.statSync(a).size;
  })[0];
  // no need to process whitespace
  // if (targetFile.indexOf(" ") !== -1) {
  //   const newTargetFile = targetFile.replace(/\s/g, "_").replace(/['"]/g, "");
  //   fs.renameSync(targetFile, newTargetFile);
  //   targetFile = newTargetFile;
  // }
  await setTaskLog({
    hash: payload.request.query.hash,
    step: "findTargetFile",
    log: {
      progress: 100,
      fpath: targetFile
    }
  });
  return targetFile;
}

module.exports = {
  findTargetFile
};
