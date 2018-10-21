const hdr = require("./headlessLogin/hdroute");
const hdrQuery = require("./query/hdroute");
const hdrQueryParse = require("./parse/hdroute");
const { hget, hset } = require("./store/redis");
const fetch = require("node-fetch");

const { transmission } = require("./transmission/util");

transmission.addFile(
  "/home/everthis/projects/pt-task/public/torrents/%5BTTG%5D%20It%27s.a.Wonderful.Life.1994.720p.BluRay.x264-WiKi.torrent",
  (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res);
  }
);

// fetch("http://127.0.0.1:3000/ttgCover?id=364865&source=ttg")
//   .then(s => s.text())
//   .then(d => console.log(d));

// (async () => {
//   let cookie = await hget("hdroute");
//   if (!cookie) {
//     cookie = (await hdr())[0];
//     await hset("hdroute", cookie);
//   }
//   const res = await hdrQuery(cookie);
//   const nodes = hdrQueryParse(res);
//   console.log(nodes);
// })();

// hset("ttg", "");
// hset("hdroute", "");
