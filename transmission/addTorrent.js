const path = require("path");
const { transmission } = require("./util");
const downloadTorrentFn = require("./downloadTorrent");

function addTorrent(fp) {
  let name = "";
  const fpath = path.join(__dirname, "..", "public", "torrents", name);
  return new Promise((reslove, reject) => {
    transmission.addFile(
      fp,
      {
        "download-dir": "/mnt/wd8t"
      },
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          reslove(res);
        }
      }
    );
  });

  // { hashString: 'a9f3e1d3cdfb7957fcbe6de861438ee8b285f7b2',
  // id: 327,
  // name: '北京女子图鉴 全20集' }
}

async function addTorrentFn(ctx, next) {
  const sourceId = ctx.request.query.sourceId;
  const fp = await downloadTorrentFn(sourceId);
  console.log(fp);
  return await addTorrent(fp);
}
module.exports = addTorrentFn;
