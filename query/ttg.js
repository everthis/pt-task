const cFetch = require("../util/cFetch");
const formGetAction = require("../util/formGetAction");
function mkQueryLink(keyword) {
  return `https://totheglory.im/browse.php?search_field=${formGetAction(
    keyword
  )}&c=M`;
}

async function ttgQuery(cookie, keyword = "wonderful") {
  const link = mkQueryLink(keyword);
  const res = await cFetch({
    url: link,
    cookie,
    type: "text"
  });
  return res;
}

module.exports = ttgQuery;
