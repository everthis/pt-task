const hdrQuery = require("./hdroute");
const ttgQuery = require("./ttg");
const hdcQuery = require("./hdchina");
const hdrLogin = require("../headlessLogin/hdroute");
const hdcLogin = require("../headlessLogin/hdchina");
const ttgLogin = require("../headlessLogin/ttg");
const hdcParse = require("../parse/hdchina");
const hdrParse = require("../parse/hdroute");
const ttgParse = require("../parse/ttg");
const { hget, hset } = require("../store/redis");

async function hdrQueryFn(ctx) {
  const { keyword: crqk, site } = ctx.request.query;
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

  // HDC
  let hdcCookie = await hget("hdchina");
  if (!hdcCookie) {
    hdcCookie = (await hdcLogin())[0];
    await hset("hdchina", hdcCookie);
  }

  const queryArr = [];
  const parseArr = [];
  if (site === "hdchina") {
    queryArr.push(hdcQuery(hdcCookie, crqk));
    parseArr.push(hdcParse);
  } else if (site === "ttg") {
    queryArr.push(ttgQuery(ttgCookie, crqk));
    parseArr.push(ttgParse);
  } else if (site === "hdroute") {
    queryArr.push(hdrQuery(hdrCookie, crqk));
    parseArr.push(hdrParse);
  } else {
    queryArr.push(
      hdcQuery(hdcCookie, crqk),
      ttgQuery(ttgCookie, crqk),
      hdrQuery(hdrCookie, crqk)
    );
    parseArr.push(hdcParse, ttgParse, hdrParse);
  }

  return await Promise.all(queryArr)
    .then(arr => {
      return Promise.all(arr.map((el, idx) => parseArr[idx](el)));
    })
    .then(arr => {
      return arr.reduce((ac, el) => {
        return ac.concat(el);
      }, []);
    });
}

module.exports = {
  hdrQueryFn
};
