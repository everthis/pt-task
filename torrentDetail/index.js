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
const hdrCoverParse = require("../parse/hdrouteTorrentCover");
const { hget, hset } = require("../store/redis");
const { stringify } = JSON;

async function torrentDetailFn(ctx) {
  const { id, source } = ctx.request.query;

  if (source === "hdroute") {
    let cookie = await hget("hdroute");
    if (!cookie) {
      cookie = (await hdrLogin())[0];
      await hset("hdroute", cookie);
    }
    const htmlStr = await hdrTorrentDetail(cookie, id);
    return stringify({
      detailHtml: await hdrDetailParse(htmlStr),
      cover: await hdrCoverParse(htmlStr)
    });
  }

  if (source === "hdchina") {
    let cookie = await hget("hdchina");
    if (!cookie) {
      cookie = (await hdcLogin())[0];
      await hset("hdchina", cookie);
    }
    const htmlStr = await hdcTorrentDetail(cookie, id);
    return stringify({
      detailHtml: await hdcDetailParse(htmlStr),
      cover: await hdcCoverParse(htmlStr)
    });
  }

  if (source === "ttg") {
    let cookie = await hget("ttg");
    if (!cookie) {
      cookie = (await ttgLogin())[0];
      await hset("ttg", cookie);
    }
    const htmlStr = await ttgTorrentDetail(cookie, id);
    return stringify({
      detailHtml: await ttgDetailParse(htmlStr),
      cover: await ttgCoverParse(htmlStr)
    });
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

async function hdrCoverFn(ctx) {
  const { id, source } = ctx.request.query;

  if (source === "hdroute") {
    let cookie = await hget("hdroute");
    if (!cookie) {
      cookie = (await hdrLogin())[0];
      await hset("hdroute", cookie);
    }
    const htmlStr = await hdrTorrentDetail(cookie, id);
    return hdrCoverParse(htmlStr);
  }
}

module.exports = {
  torrentDetailFn,
  hdrCoverFn,
  ttgCoverFn,
  hdcCoverFn
};
