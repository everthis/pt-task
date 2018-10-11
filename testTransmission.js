require("dotenv").config();
const path = require("path");
const fp = path.resolve(__dirname, "[HDC].北京女子图鉴 全20集.torrent");
const Transmission = require("transmission");
const transmission = new Transmission({
  port: 9091, // DEFAULT : 9091
  host: "192.168.1.209", // DEAFULT : 127.0.0.1
  username: process.env.TRANSMISSION_USERNAME, // DEFAULT : BLANK
  password: process.env.TRANSMISSION_PASSWORD // DEFAULT : BLANK
});

const checkTorrentProgress = require("./transmission/checkTorrentProgress");
checkTorrentProgress(328);

// transmission.addFile(fp, function(err, arg) {
//   console.log(err);
//   console.log(arg);
// });

// function deleteTorrent(id) {
//   transmission.remove(id, true, function(err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//     }
//   });
// }

// deleteTorrent(327);
