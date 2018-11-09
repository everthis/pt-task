const bull = require("bull");
const uploadQueue = new bull("upload", "redis://127.0.0.1:6379");

uploadQueue.process(function(job) {
  // Simply return a promise
  return new Promise((reslove, reject) => {});
});

module.exports = uploadQueue;
