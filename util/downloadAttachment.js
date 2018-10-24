const request = require("request");
const fs = require("fs");
const path = require("path");
const util = require("util");
const fetch = require("node-fetch");
const fsWriteFileAsync = util.promisify(fs.writeFile);

function filePath(name) {
  return path.resolve(__dirname, "..", "public", "torrents", name);
}

async function downloadAttachment(url, cookie) {
  let filename = "";
  return await fetch(url, {
    headers: {
      cookie
    }
  })
    .then(r => {
      const hash = {};
      for (var pair of r.headers.entries()) {
        hash[pair[0]] = pair[1];
      }
      console.log(JSON.stringify(hash, null, 2));
      const idx = hash["content-disposition"].indexOf("filename=");
      const filenameWithQuotes = hash["content-disposition"]
        .slice(idx + 9)
        .split(";")[0];
      if (
        filenameWithQuotes.startsWith("'") ||
        filenameWithQuotes.startsWith('"')
      ) {
        filename = filenameWithQuotes.slice(1, filenameWithQuotes.length - 1);
      } else {
        filename = filenameWithQuotes.slice(0);
      }
      return r.arrayBuffer();
    })
    .then(async data => {
      const fp = filePath(filename);
      await fsWriteFileAsync(fp, Buffer.from(data));
      console.log("download done.");
      return fp;
    });
}

module.exports = downloadAttachment;
