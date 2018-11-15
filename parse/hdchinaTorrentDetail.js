const cheerio = require("cheerio");
async function hdchinaTorrentDetailParser(str) {
  const $ = cheerio.load(str);
  const res = $("#kdescr")
    .html()
    .replace(/src="/g, 'src="https://hdchina.org/');

  return res;
}

module.exports = hdchinaTorrentDetailParser;
