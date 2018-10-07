const hdrLogin = require("../headlessLogin/hdroute");
const { hget, hset } = require("../store/redis");
async function hdrCookie() {
  let cookie = await hget("hdroute");
  if (!cookie) {
    cookie = (await hdrLogin())[0];
    await hset("hdroute", cookie);
  }
  return cookie;
}

module.exports = {
  hdrCookie
};
