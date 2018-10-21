const hdrTorrentDetail = require("./hdroute");
const ttgTorrentDetail = require("./ttg");
const hdrLogin = require("../headlessLogin/hdroute");
const ttgLogin = require("../headlessLogin/ttg");
const hdrDetailParse = require("../parse/hdrouteTorrentDetail");
const ttgDetailParse = require("../parse/ttgTorrentDetail");
const ttgCoverParse = require("../parse/ttgTorrentCover");
const { hget, hset } = require("../store/redis");

async function hdrTorrentDetailFn(ctx) {
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

module.exports = {
  hdrTorrentDetailFn,
  ttgCoverFn
};
