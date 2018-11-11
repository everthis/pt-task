const { transmission } = require("./util");
const setTaskLog = require("../util/setTaskLog");

function removeTorrentAndData(hash) {
  return new Promise((resolve, reject) => {
    transmission.remove(hash, true, async (err, result) => {
      if (err) {
        console.log(err);
        await setTaskLog({
          hash,
          step: "removeTorrentAndData",
          log: {
            progress: 0,
            status: err.message
          }
        });
        reject(err);
      } else {
        await setTaskLog({
          hash,
          step: "removeTorrentAndData",
          log: {
            progress: 100
          }
        });
        resolve(result);
      }
    });
  });
}
module.exports = removeTorrentAndData;
