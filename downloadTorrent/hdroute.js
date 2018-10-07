const path = require("path");
const downloadAttachment = require("../util/downloadAttachment");

const { hdrCookie } = require("../util/getCookie");
function downloadTorrentLink(id) {
  return `http://hdroute.org/download.php?id=${id}`;
}

function filePath(name) {
  return path.resolve(__dirname, "..", "public", name);
}
async function downloadTorrent(id = 68390) {
  const cookie = await hdrCookie();

  await downloadAttachment(downloadTorrentLink(id), cookie);
}

module.exports = downloadTorrent;
