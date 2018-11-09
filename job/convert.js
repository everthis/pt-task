const bull = require("bull");
const convertQueue = new bull("convert", "redis://127.0.0.1:6379");

convertQueue.process(function(job) {
  // Simply return a promise
  return new Promise((reslove, reject) => {});
});

module.exports = convertQueue;
