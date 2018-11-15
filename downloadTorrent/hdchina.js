const path = require("path");
const downloadAttachment = require("../util/downloadAttachment");

const { hdcCookie } = require("../util/getCookie");
function downloadTorrentLink(id) {
  return `https://hdchina.org/download.php?id=${id}`;
}

function filePath(name) {
  return path.resolve(__dirname, "..", "public", name);
}
async function downloadTorrent(id = 0) {
  const cookie = await hdcCookie();

  return await downloadAttachment(downloadTorrentLink(id), cookie);
}

module.exports = downloadTorrent;
