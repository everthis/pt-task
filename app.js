const Koa = require("koa");
const Router = require("koa-router");

const { hdrQueryFn } = require("./query/index");
const app = new Koa();
const router = new Router();

router.get("/query", async (ctx, next) => {
  ctx.body = await hdrQueryFn(ctx);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
