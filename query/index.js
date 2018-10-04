const hdrQuery = require("./hdroute");
const hdrLogin = require("../headlessLogin/hdroute");
const hdrParse = require("../parse/hdroute");
const { hget, hset } = require("../store/redis");

async function hdrQueryFn(ctx) {
  const crqk = (ctx.request.query || {}).keyword;
  let cookie = await hget("hdroute");
  if (!cookie) {
    cookie = (await hdrLogin())[0];
    await hset("hdroute", cookie);
  }
  const htmlStr = await hdrQuery(cookie, crqk);
  return hdrParse(htmlStr);
}

module.exports = {
  hdrQueryFn
};
