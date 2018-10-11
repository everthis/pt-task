const { transmission } = require("./util");

function removeTorrentAndData(id) {
  return new Promise((resolve, reject) => {
    transmission.remove(id, true, function(err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
module.exports = removeTorrentAndData;
