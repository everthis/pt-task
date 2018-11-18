const hdrQuery = require("./hdroute");
const ttgQuery = require("./ttg");
const hdcQuery = require("./hdchina");
const hdrLogin = require("../headlessLogin/hdroute");
const hdcLogin = require("../headlessLogin/hdchina");
const ttgLogin = require("../headlessLogin/ttg");
const hdcParse = require("../parse/hdchina");
const hdrParse = require("../parse/hdroute");
const ttgParse = require("../parse/ttg");
const raceWithTimeout = require("../util/raceWithTimeout");
const { hget, hset } = require("../store/redis");

async function queryFn(ctx) {
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

  const promiseArr = [];
  if (site === "hdchina") {
    const hdcQueryAndParse = hdcQuery(hdcCookie, crqk).then(hdcParse);
    promiseArr.push(raceWithTimeout("hdchina", hdcQueryAndParse));
  } else if (site === "ttg") {
    const ttgQueryAndParse = ttgQuery(ttgCookie, crqk).then(ttgParse);
    promiseArr.push(raceWithTimeout("ttg", ttgQueryAndParse));
  } else if (site === "hdroute") {
    const hdrQueryAndParse = hdrQuery(hdrCookie, crqk).then(hdrParse);
    promiseArr.push(raceWithTimeout("hdroute", hdrQueryAndParse));
  } else {
    promiseArr.push(
      raceWithTimeout("hdchina", hdcQuery(hdcCookie, crqk).then(hdcParse)),
      raceWithTimeout("ttg", ttgQuery(ttgCookie, crqk).then(ttgParse)),
      raceWithTimeout("hdroute", hdrQuery(hdrCookie, crqk).then(hdrParse))
    );
  }

  return await Promise.all(promiseArr).then(arr => {
    return arr.reduce((ac, el) => {
      return ac.concat(el);
    }, []);
  });

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
  queryFn
};
