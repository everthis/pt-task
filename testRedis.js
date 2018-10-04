const { hget, hset } = require("./store/redis");
(async () => {
  //   const sval = await hset("hdroute", "");
  const gval = await hget("hdroute");
  console.log(gval);
  console.log("get");
})();
