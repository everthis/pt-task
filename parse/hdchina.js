const cheerio = require("cheerio");
async function hdchinaQueryParser(str) {
  const $ = cheerio.load(str);
  const dls = $("#form_torrent > .torrent_list > tbody > tr");
  const records = $("#form_torrent .pagination li:nth-last-child(2) a")
    .text()
    .split("-")[1]
    .trim();
  const dlsArr = Array.prototype.slice.call(dls, 1);
  const res = [];

  const opts = {};
  Array.prototype.slice.call($(".option_table .input_box")).forEach(el => {
    if (
      $("a", el).attr("href") &&
      $("a", el)
        .attr("href")
        .startsWith("?cat=")
    ) {
      opts[$("a", el).attr("href")] = $("a", el).text();
    }
  });

  const torrentSource = "hdchina";
  for (let el of dlsArr) {
    const chsTitle = $("td.t_name tr > td:nth-child(2) h4", el).text();
    const engTitle = $("td.t_name tr > td:nth-child(2) h3 a", el).text();
    const torrentId = $("td.t_name .t_pin + td h3 a", el)
      .attr("href")
      .split("&")[0]
      .split("=")[1];
    const imdbLink = "";
    const torrentSize = $("td.t_size", el).text();
    const torrentCreatedAt = $("td.t_time span", el).attr("title");
    const peersCount = $("td.t_torrents a", el).text();
    const downloadingCount = $("td.t_leech", el).text();
    const coverPic = "https://hdchina.org/styles/images/logo_hdchina.png";
    const torrentCategory = opts[$("td.t_cat a", el).attr("href")];
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
    total: records,
    source: torrentSource,
    list: res
  };
}

module.exports = hdchinaQueryParser;
