const cheerio = require("cheerio");
async function hdchinaTorrentDetailParser(str) {
  const $ = cheerio.load(str);
  const res = $("#kdescr").html();

  return res;
}

module.exports = hdchinaTorrentDetailParser;
