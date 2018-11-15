const hdrLogin = require("../headlessLogin/hdroute");
const hdcLogin = require("../headlessLogin/hdchina");
const ttgLogin = require("../headlessLogin/ttg");
const { hget, hset } = require("../store/redis");
async function hdrCookie() {
  let cookie = await hget("hdroute");
  if (!cookie) {
    cookie = (await hdrLogin())[0];
    await hset("hdroute", cookie);
  }
  return cookie;
}

async function ttgCookie() {
  let cookie = await hget("ttg");
  if (!cookie) {
    cookie = (await ttgLogin())[0];
    await hset("ttg", cookie);
  }
  return cookie;
}

async function hdcCookie() {
  let cookie = await hget("hdchina");
  if (!cookie) {
    cookie = (await hdcLogin())[0];
    await hset("hdchina", cookie);
  }
  return cookie;
}

module.exports = {
  hdrCookie,
  ttgCookie,
  hdcCookie
};
