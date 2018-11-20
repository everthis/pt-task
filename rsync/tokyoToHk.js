require("dotenv").config();
const Rsync = require("rsync");
const path = require("path");
const fs = require("fs");
const bull = require("bull");
const setTaskLog = require("../util/setTaskLog");
const { REDIS_HOST_PORT, HK_USER_HOST } = process.env;
const rsyncQueue = new bull("pt-task-rsync", REDIS_HOST_PORT);


rsyncQueue.process(async job => {
  const { fpath, hash } = job.data;
  const startTs = new Date().getTime();

  return new Promise((reslove, reject) => {
    // Build the command
    // set --info=progress2 or --no-inc-recursive may help
    const rsync = new Rsync()
    .set('remove-source-files')
      .shell("ssh")
      .flags("az")
      .progress()
      .source(
        `${HK_USER_HOST}:${fpath}`
      )
      .destination(fpath);
    
    // Execute the command
    rsync.execute(function(err, code, cmd) {
      // we're done
      if (err) {
        console.log("---err---", err);
      }
    
      console.log(code);
      console.log(cmd);
    }, function(data) {
      console.log(data.toString('utf-8'))
    },  function(data) {
      console.log(data.toString('utf-8'))
    } );

  });
});


async function rsyncFn({fpath, hash}) {
  return await rsyncQueue.add({fpath, hash})
}


module.exports = rsyncFn
