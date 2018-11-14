const cheerio = require("cheerio");
async function hdchinaTorrentCoverParser(str) {
  const $ = cheerio.load(str);
  const res = $(".poster_box .imgbox img").attr("src");

  return res;
}

module.exports = hdchinaTorrentCoverParser;
