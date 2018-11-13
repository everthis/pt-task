const cFetch = require("../util/cFetch");
const formGetAction = require("../util/formGetAction");
function mkQueryLink(keyword) {
  return `https://hdchina.org/torrents.php?search=${formGetAction(
    keyword
  )}&incldead=1&sort=7&type=desc`;
}

async function hdcQuery(cookie, keyword = "1946") {
  const link = mkQueryLink(keyword);
  const res = await cFetch({
    url: link,
    cookie,
    type: "text"
  });
  return res;
}

module.exports = hdcQuery;
