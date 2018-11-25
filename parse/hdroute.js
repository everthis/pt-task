const cheerio = require("cheerio");
async function hdrouteQueryParser(str) {
  const torrentSource = "hdroute";
  try {
    const $ = cheerio.load(str);
    const dls = $("#unsticky-torrent-table > dl");
    const total = (
      $("#pager-top > p > span a:last-child b")
        .text()
        .split("-")[1] ||
      $("#pager-top > p > b")
        .text()
        .split("-")[1] ||
      "0"
    ).trim();
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
      let tmp = $(".introForPic > img", el).attr("src");
      const coverPic =
        tmp && tmp.startsWith("http")
          ? tmp
          : "http://hdroute.org/img/theme1/default.jpg";
      const torrentCategory = $(".torrent_category figure", el)
        .attr("class")
        .split("_")[1]
        .slice(1);
      res.push({
        chsTitle,
        engTitle,
        torrentId,
        imdbLink,
        torrentSize,
        torrentCreatedAt,
        peersCount,
        downloadingCount,
        coverPic,
        torrentCategory,
        torrentSource
      });
    }
    return {
      total,
      source: torrentSource,
      list: res
    };
  } catch (err) {
    console.log(err);
    return {
      _type: "timeout",
      total: "error",
      source: torrentSource,
      list: []
    };
  }
}

module.exports = hdrouteQueryParser;
