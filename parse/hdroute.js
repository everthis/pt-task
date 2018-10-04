const cheerio = require("cheerio");
async function hdrouteQueryParser(str) {
  const $ = cheerio.load(str);
  const dls = $("#unsticky-torrent-table > dl");
  const dlsArr = Array.prototype.slice.call(dls);
  const res = [];
  for (let el of dlsArr) {
    const chsTitle = $(".title_chs", el).text();
    const engTitle = $(".title_eng", el).text();
    const torrentId = $(".torrent_detail_icon > a", el)
      .attr("href")
      .split("=")[1];
    const imdbLink = $(".torrent-imdb > a", el).attr("href");
    const torrentSize = $(".torrent_size", el).text();
    const torrentCreatedAt = $(".torrent_added", el).html();
    const peersCount = $(".torrent_added_hour + .torrent_count", el).text();
    const downloadingCount = $(".torrent_count + .torrent_count", el).text();
    const coverPic = $(".introForPic > img", el).attr("src");
    res.push({
      chsTitle,
      engTitle,
      torrentId,
      imdbLink,
      torrentSize,
      torrentCreatedAt,
      peersCount,
      downloadingCount,
      coverPic
    });
  }
  return res;
}

module.exports = hdrouteQueryParser;
