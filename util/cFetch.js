const fetch = require("node-fetch");
const querystring = require("querystring");

function cFetch({ cookie, url, type = "json" }) {
  console.log(url);
  return fetch(`${url}`, {
    headers: {
      cookie
    },
    redirect: "follow"
  }).then(r => (type === "json" ? r.json() : r.text()));
}

module.exports = cFetch;
