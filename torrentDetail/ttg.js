const cFetch = require("../util/cFetch");
function detailLink(id) {
  return `https://totheglory.im/t/${id}/`;
}

async function ttgTorrentDetail(cookie, id = "1946") {
  const link = detailLink(id);
  const res = await cFetch({
    url: link,
    cookie,
    type: "text"
  });
  return res;
}

module.exports = ttgTorrentDetail;
