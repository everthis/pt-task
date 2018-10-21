const cFetch = require("../util/cFetch");
function detailLink(id) {
  return `http://hdroute.org/details.php?id=${id}`;
}

async function hdrTorrentDetail(cookie, id = "1946") {
  const link = detailLink(id);
  const res = await cFetch({
    url: link,
    cookie,
    type: "text"
  });
  return res;
}

module.exports = hdrTorrentDetail;
