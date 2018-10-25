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
          status: `${getStatusType(torrent.status)}`,
          total_size: `${(
            torrent.totalSize / Math.pow(Math.pow(2, 10), 3)
          ).toFixed(3)} GB`,
          time_taken: `${(
            (torrent.doneDate - torrent.startDate) /
            3600
          ).toFixed(3)} h`,
          avg_speed: `${(
            (torrent.totalSize * 8) /
            ((torrent.doneDate - torrent.startDate) *
              Math.pow(Math.pow(2, 10), 2))
          ).toFixed(3)} Mbps`
        };
        resolve(res);
      }
    });
  });
}
module.exports = checkTorrentProgress;
