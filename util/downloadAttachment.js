const request = require("request");
const fs = require("fs");
const path = require("path");
const util = require("util");
const fetch = require("node-fetch");
const fsWriteFileAsync = util.promisify(fs.writeFile);

function filePath(name) {
  return path.resolve(__dirname, "..", "public", name);
}

async function downloadAttachment(url, cookie) {
  let filename = "";
  fetch(url, {
    headers: {
      cookie
    }
  })
    .then(r => {
      const hash = {};
      for (var pair of r.headers.entries()) {
        hash[pair[0]] = pair[1];
      }
      const idx = hash["content-disposition"].indexOf("filename=");
      const filenameWithQuotes = hash["content-disposition"].slice(idx + 9);
      filename = filenameWithQuotes.slice(1, filenameWithQuotes.length - 1);
      return r.arrayBuffer();
    })
    .then(async data => {
      const fp = filePath(filename);
      console.log(fp);
      await fsWriteFileAsync(fp, Buffer.from(data));
      console.log("download done.");
    });
}

module.exports = downloadAttachment;
