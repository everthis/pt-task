const cheerio = require("cheerio");
async function ttgTorrentDetailParser(str) {
  const $ = cheerio.load(str);
  const res = $("#kt_d")
    .html()
    .replace(/src="\//g, 'src="https://totheglory.im/');

  return res;
}

module.exports = ttgTorrentDetailParser;
