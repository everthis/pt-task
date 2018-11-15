const hdr = require("./headlessLogin/hdroute");
const hdrQuery = require("./query/hdroute");
const hdrQueryParse = require("./parse/hdroute");
const { hget, hset } = require("./store/redis");
const fetch = require("node-fetch");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

const { transmission } = require("./transmission/util");

const checkTorrentProgress = require("./transmission/checkTorrentProgress");

const { findTargetFile } = require("./ffmpeg/findTargetFile");
const { convertFn } = require("./ffmpeg/convert");

const { aliUpload } = require("./upload/aliOss");

const { bucketACL, client } = require("./aliOssAccess/private");

fetch("http://localhost:3000/torrentDetail?id=282806&source=hdchina")
  .then(r => r.json())
  .then(r => console.log(r))
  .catch(err => console.log(err));
// const captcha = require("./cap");
// const buf = fs.readFileSync("cap1.png");

// const pixMap = captcha.getPixelMapFromBuffer(buf);

// console.log(captcha.getCaptcha(pixMap));

// const imgPath = path.join(__dirname, "test_1.jpg");
// console.log(imgPath);
// Tesseract.recognize(imgPath).then(function(result) {
//   console.log(result);
// });

// console.log(
//   client.signatureUrl("(500).Days.of.Summer.2009.Bluray.720p.DTS.x264-CHD.mp4")
// );

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

// findTargetFile("b7a19096be97227074fc311e7f388fbc3c8fe4be").then(r =>
//   console.log(r)
// );
// findTargetFile("d3033f402065e1f93b966c0df766d94737b306b6");

// convertFn({
//   fpath:
//     "/mnt/wd6t/(500).Days.of.Summer.2009.Bluray.720p.DTS.x264-CHD/(500).Days.of.Summer.2009.Bluray.720p.DTS.x264-CHD.mkv",
//   hash: "ada8fd104d1b4457f5a54886e6fc839108e973c5"
// });

// aliUpload({
//   hash: "ada8fd104d1b4457f5a54886e6fc839108e973c5",
//   filePath:
//     "/home/everthis/projects/pt-task/public/downloads/(500).Days.of.Summer.2009.Bluray.720p.DTS.x264-CHD.mp4"
// });

// bucketACL();
