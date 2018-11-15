const cheerio = require("cheerio");
async function hdchinaTorrentCoverParser(str) {
  const $ = cheerio.load(str);
  const res = $(".poster_box .imgbox img").attr("src");
  if (res == null) {
    return "https://hdchina.org/styles/images/bg-noposter.png";
  }
  if (res.startsWith("http")) {
    return res;
  } else {
    return `https://hdchina.org/${res}`;
  }
}

module.exports = hdchinaTorrentCoverParser;
