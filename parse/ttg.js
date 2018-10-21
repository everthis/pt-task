const cheerio = require("cheerio");
async function ttgQueryParser(str) {
  const $ = cheerio.load(str);
  const dls = $("#torrent_table tr.hover_hr");
  const dlsArr = Array.prototype.slice.call(dls);
  const res = [];
  for (let el of dlsArr) {
    const chsTitle = $(".name_left b span", el).text();
    const engTitle = $(".name_left b", el)
      .text()
      .split(chsTitle)
      .join("");
    const torrentId = $(el).attr("id");
    const imdbLink = $(".imdb_rate > a", el).attr("href");
    const torrentSize = $("td:nth-child(7)", el).text();
    const torrentCreatedAt = $("td:nth-child(5) nobr", el).text();
    const peersCount = $("td:nth-child(9) > b:first-child font", el).text();
    const downloadingCount = $("td:nth-child(9) > b:last-child", el).text();

    const coverPic = "https://totheglory.im/pic/ttg_logo_1.png";
    const torrentCategory = $("td:first-child img", el).attr("alt");
    const torrentSource = "ttg";
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
  return res;
}

module.exports = ttgQueryParser;
