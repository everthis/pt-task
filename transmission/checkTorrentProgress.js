const { transmission, getStatusType } = require("./util");

function checkTorrentProgress(ctx) {
  const { hash } = ctx.request.query;
  return new Promise((resolve, reject) => {
    transmission.get(hash, function(err, result) {
      if (err) {
        reject(err);
      }
      console.log(result);
      if (result.torrents.length > 0) {
        const torrent = result.torrents[0];
        const res = {
          name: torrent.name,
          download_rate: `${torrent.rateDownload / 1000} Mbps`,
          upload_rate: `${torrent.rateUpload / 1000} Mbps`,
          progress: `${torrent.percentDone * 100}%`,
          ETA: `${torrent.eta < 0 ? 0 : torrent.eta / 3600} h`,
          status: `${getStatusType(torrent.status)}`
        };
        resolve(res);
      }
    });
  });
}
module.exports = checkTorrentProgress;
