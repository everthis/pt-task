const cheerio = require("cheerio");
async function hdchinaTorrentDetailParser(str) {
  const $ = cheerio.load(str);
  const res = $("#kdescr")
    .html()
    .replace(
      /(\<img.+src=[\"|\'])(?!https?:\/\/)([^\/].+?)([\"|\'])/g,
      function(...args) {
        return args[1] + "https://hdchina.org/" + args[2] + args[3];
      }
    );

  return res;
}

module.exports = hdchinaTorrentDetailParser;
