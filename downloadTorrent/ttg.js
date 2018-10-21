const path = require("path");
const cheerio = require("cheerio");
const downloadAttachment = require("../util/downloadAttachment");
const torrentDetail = require("../torrentDetail/ttg");

const { ttgCookie } = require("../util/getCookie");

function downloadTorrentLink(p) {
  return `https://totheglory.im${p}`;
}

function parseDownloadLink(str) {
  const $ = cheerio.load(str);
  return $("img + a.index:first-of-type").attr("href");
}

async function downloadTorrent(id = 0) {
  const cookie = await ttgCookie();
  const htmlStr = await torrentDetail(cookie, id);
  const dlPath = await parseDownloadLink(htmlStr);
  return await downloadAttachment(downloadTorrentLink(dlPath), cookie);
}

module.exports = downloadTorrent;
