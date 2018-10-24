const Koa = require("koa");
const Router = require("koa-router");

const { hdrQueryFn } = require("./query/index");
const { hdrTorrentDetailFn, ttgCoverFn } = require("./torrentDetail/index");

const addTorrent = require("./transmission/addTorrent");
const checkTorrentProgress = require("./transmission/checkTorrentProgress");
const app = new Koa();
const router = new Router();

router.get("/query", async (ctx, next) => {
  ctx.body = await hdrQueryFn(ctx);
});

router.get("/torrentDetail", async (ctx, next) => {
  ctx.body = await hdrTorrentDetailFn(ctx);
});

router.get("/ttgCover", async (ctx, next) => {
  ctx.body = await ttgCoverFn(ctx);
});

router.get("/addTorrent", async (ctx, next) => {
  ctx.body = await addTorrent(ctx);
});

router.get("/checkProgress", async (ctx, next) => {
  ctx.body = await checkTorrentProgress(ctx);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
