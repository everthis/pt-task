const cheerio = require("cheerio");
async function hdrouteTorrentDetailParser(str) {
  const $ = cheerio.load(str);
  const res = $(".details-description-section").html();

  return res;
}

module.exports = hdrouteTorrentDetailParser;
