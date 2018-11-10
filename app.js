const Koa = require("koa");
const Router = require("koa-router");

const { hdrQueryFn } = require("./query/index");
const { hdrTorrentDetailFn, ttgCoverFn } = require("./torrentDetail/index");

const addTorrent = require("./transmission/addTorrent");
const checkTorrentProgress = require("./transmission/checkTorrentProgress");
const { findTargetFile } = require("./ffmpeg/findTargetFile");
const { convertFn } = require("./ffmpeg/convert");
const { aliUpload } = require("./upload/aliOss");
const { getSignUrl } = require("./aliOssAccess/private");
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

router.get("/findTargetFile", async (ctx, next) => {
  ctx.body = await findTargetFile(ctx);
});

router.get("/convert", async (ctx, next) => {
  const { fpath, hash } = ctx.request.query;
  ctx.body = await convertFn({ fpath, hash });
});

router.get("/upload", async (ctx, next) => {
  const { fpath, hash } = ctx.request.query;
  ctx.body = await aliUpload({
    fpath,
    hash
  });
});

router.get("/getSignUrl", async (ctx, next) => {
  const { fpath } = ctx.request.query;
  const p = decodeURIComponent(fpath);
  ctx.body = getSignUrl(p);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
