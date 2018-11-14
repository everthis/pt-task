const hdrTorrentDetail = require("./hdroute");
const hdcTorrentDetail = require("./hdchina");
const ttgTorrentDetail = require("./ttg");
const hdrLogin = require("../headlessLogin/hdroute");
const hdcLogin = require("../headlessLogin/hdchina");
const ttgLogin = require("../headlessLogin/ttg");
const hdrDetailParse = require("../parse/hdrouteTorrentDetail");
const hdcDetailParse = require("../parse/hdchinaTorrentDetail");
const ttgDetailParse = require("../parse/ttgTorrentDetail");
const ttgCoverParse = require("../parse/ttgTorrentCover");
const hdcCoverParse = require("../parse/hdchinaTorrentCover");
const { hget, hset } = require("../store/redis");

async function torrentDetailFn(ctx) {
  const { id, source } = ctx.request.query;

  if (source === "hdroute") {
    let cookie = await hget("hdroute");
    if (!cookie) {
      cookie = (await hdrLogin())[0];
      await hset("hdroute", cookie);
    }
    const htmlStr = await hdrTorrentDetail(cookie, id);
    return hdrDetailParse(htmlStr);
  }

  if (source === "hdchina") {
    let cookie = await hget("hdchina");
    if (!cookie) {
      cookie = (await hdcLogin())[0];
      await hset("hdchina", cookie);
    }
    const htmlStr = await hdcTorrentDetail(cookie, id);
    return hdcDetailParse(htmlStr);
  }

  if (source === "ttg") {
    let cookie = await hget("ttg");
    if (!cookie) {
      cookie = (await ttgLogin())[0];
      await hset("ttg", cookie);
    }
    const htmlStr = await ttgTorrentDetail(cookie, id);
    return ttgDetailParse(htmlStr);
  }
}

async function ttgCoverFn(ctx) {
  const { id, source } = ctx.request.query;

  if (source === "ttg") {
    let cookie = await hget("ttg");
    if (!cookie) {
      cookie = (await ttgLogin())[0];
      await hset("ttg", cookie);
    }
    const htmlStr = await ttgTorrentDetail(cookie, id);
    return ttgCoverParse(htmlStr);
  }
}

async function hdcCoverFn(ctx) {
  const { id, source } = ctx.request.query;

  if (source === "hdchina") {
    let cookie = await hget("hdchina");
    if (!cookie) {
      cookie = (await hdcLogin())[0];
      await hset("hdchina", cookie);
    }
    const htmlStr = await hdcTorrentDetail(cookie, id);
    return hdcCoverParse(htmlStr);
  }
}

module.exports = {
  torrentDetailFn,
  ttgCoverFn,
  hdcCoverFn
};
