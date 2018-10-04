const cFetch = require("../util/cFetch");
const formGetAction = require("../util/formGetAction");
function mkQueryLink(keyword) {
  return `http://hdroute.org/browse.php?s=${formGetAction(
    keyword
  )}&dp=0&add=0&action=s&or=1&imdb=`;
}

async function hdrQuery(cookie, keyword = "1946") {
  const link = mkQueryLink(keyword);
  const res = await cFetch({
    url: link,
    cookie,
    type: "text"
  });
  return res;
}

module.exports = hdrQuery;
