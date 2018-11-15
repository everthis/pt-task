const ttgDownloadTorrent = require("../downloadTorrent/ttg");
const hdrouteDownloadTorrent = require("../downloadTorrent/hdroute");
const hdchinaDownloadTorrent = require("../downloadTorrent/hdchina");

async function downloadTorrentFn(sourceId) {
  const arr = sourceId.split("_");
  if (arr[0] === "ttg") {
    return await ttgDownloadTorrent(+arr[1]);
  } else if (arr[0] === "hdroute") {
    return await hdrouteDownloadTorrent(+arr[1]);
  } else if (arr[0] === "hdchina") {
    return await hdchinaDownloadTorrent(+arr[1]);
  }
}

module.exports = downloadTorrentFn;
