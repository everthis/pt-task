const cFetch = require("../util/cFetch");
function mkQueryLink(keyword) {
  return `https://totheglory.im/browse.php?search_field=${keyword}&c=M`;
}

async function ttgQuery(cookie) {
  const link = mkQueryLink("wonderful");
  const res = await cFetch({
    url: link,
    cookie
  });
  console.log(res);
}

module.exports = ttgQuery;
