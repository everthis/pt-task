const cheerio = require("cheerio");
async function ttgTorrentCoverParser(str) {
  const $ = cheerio.load(str);
  const res = $("#kt_d > img:first-of-type").attr("src");

  return res;
}

module.exports = ttgTorrentCoverParser;
