const hdrQuery = require("./hdroute");
const ttgQuery = require("./ttg");
const hdrLogin = require("../headlessLogin/hdroute");
const ttgLogin = require("../headlessLogin/ttg");
const hdrParse = require("../parse/hdroute");
const ttgParse = require("../parse/ttg");
const { hget, hset } = require("../store/redis");

async function hdrQueryFn(ctx) {
  const crqk = (ctx.request.query || {}).keyword;
  // HDR
  let hdrCookie = await hget("hdroute");
  if (!hdrCookie) {
    hdrCookie = (await hdrLogin())[0];
    await hset("hdroute", hdrCookie);
  }

  // TTG
  let ttgCookie = await hget("ttg");
  if (!ttgCookie) {
    ttgCookie = (await ttgLogin())[0];
    await hset("ttg", ttgCookie);
  }

  return await Promise.all([
    hdrQuery(hdrCookie, crqk),
    ttgQuery(ttgCookie, crqk)
  ])
    .then(arr => {
      return Promise.all([hdrParse(arr[0]), ttgParse(arr[1])]);
    })
    .then(arr => {
      return arr[1].concat(arr[0]);
    });
}

module.exports = {
  hdrQueryFn
};
