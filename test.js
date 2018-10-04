const hdr = require("./headlessLogin/hdroute");
const hdrQuery = require("./query/hdroute");
const hdrQueryParse = require("./parse/hdroute");
const { hget, hset } = require("./store/redis");

(async () => {
  let cookie = await hget("hdroute");
  if (!cookie) {
    cookie = (await hdr())[0];
    await hset("hdroute", cookie);
  }
  const res = await hdrQuery(cookie);
  const nodes = hdrQueryParse(res);
  console.log(nodes);
})();
