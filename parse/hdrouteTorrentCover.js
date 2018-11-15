const cheerio = require("cheerio");
async function hdchinaTorrentCoverParser(str) {
  const $ = cheerio.load(str);
  const res = $("#main .details-poster-section img").attr("src");

  return res;
}

module.exports = hdchinaTorrentCoverParser;
