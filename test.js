const hdr = require("./headlessLogin/hdroute");
const hdrQuery = require("./query/hdroute");
const hdrQueryParse = require("./parse/hdroute");
const { hget, hset } = require("./store/redis");
const fetch = require("node-fetch");

const { transmission } = require("./transmission/util");

const checkTorrentProgress = require("./transmission/checkTorrentProgress");

const { findTargetFile } = require("./ffmpeg/findTargetFile");
const { convertFn } = require("./ffmpeg/convert");

// transmission.addFile(
//   "/home/everthis/projects/pt-task/public/torrents/%5BTTG%5D%20It%27s.a.Wonderful.Life.1994.720p.BluRay.x264-WiKi.torrent",
//   (err, res) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(res);
//   }
// );

// checkTorrentProgress({
//   request: {
//     query: {
//       hash: "80239f38422b17d2f46429fce19881d838c02589"
//     }
//   }
// }).then(res => console.log(res));

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

// findTargetFile("db1e460c8388b3ab2ccc59951070befaa6b7d1fa");
// findTargetFile("d3033f402065e1f93b966c0df766d94737b306b6");

console.log(convertFn);
convertFn(
  "/mnt/wd8t/21.Grams.2003.BluRay.720p.x264.DTS-WiKi/21.Grams.2003.BluRay.720p.x264.DTS-WiKi.mkv"
);
