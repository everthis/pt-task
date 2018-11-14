const cFetch = require("../util/cFetch");
function detailLink(id) {
  return `https://hdchina.org/details.php?id=${id}&hit=1`;
}

async function hdcTorrentDetail(cookie, id = "1946") {
  const link = detailLink(id);
  const res = await cFetch({
    url: link,
    cookie,
    type: "text"
  });
  return res;
}

module.exports = hdcTorrentDetail;
