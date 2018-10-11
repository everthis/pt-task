const { transmission, getStatusType } = require("./util");

function checkTorrentProgress(id) {
  return new Promise((resolve, reject) => {
    transmission.get(id, function(err, result) {
      if (err) {
        reject(err);
      }
      console.log(result);
      if (result.torrents.length > 0) {
        // console.log(result.torrents[0]);			// Gets all details
        console.log("Name = " + result.torrents[0].name);
        console.log(
          "Download Rate = " + result.torrents[0].rateDownload / 1000
        );
        console.log("Upload Rate = " + result.torrents[0].rateUpload / 1000);
        console.log("Completed = " + result.torrents[0].percentDone * 100);
        console.log("ETA = " + result.torrents[0].eta / 3600);
        console.log("Status = " + getStatusType(result.torrents[0].status));
        resolve(result);
      }
    });
  });
}
module.exports = checkTorrentProgress;
