const path = require("path");
const { transmission } = require("./util");
const util = require("util");
const addFileAsync = util.promisify(transmission.addFile);

function addTorrent(name) {
  const fp = path.join(__dirname, "..", "public", "torrents", name);
  return addFileAsync(fp);

  // { hashString: 'a9f3e1d3cdfb7957fcbe6de861438ee8b285f7b2',
  // id: 327,
  // name: '北京女子图鉴 全20集' }
}
module.exports = addTorrent;
