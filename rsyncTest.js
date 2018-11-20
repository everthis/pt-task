require("dotenv").config();
const Rsync = require("rsync");
const path = require("path");
const fs = require("fs");
const bull = require("bull");
const setTaskLog = require("./util/setTaskLog");
const { REDIS_HOST_PORT, TOKYO_USER_HOST } = process.env;
function exec(job) {
    const { fpath, hash } = job;
    const startTs = new Date().getTime();
  
    return new Promise((reslove, reject) => {
      // Build the command
      // set --info=progress2 or --no-inc-recursive may help
      const rsync = new Rsync()
        .shell("ssh")
        .flags("az")
        .progress()
        .source(
          `${TOKYO_USER_HOST}:${fpath}`
        )
        .destination(fpath);
      
      // Execute the command
      rsync.execute(async (err, code, cmd) => {
        // we're done
        if (err) {
          console.log("---err---", err);
          reject(err)
        }
        const payload = {
            hash,
            step: "rsync",
            log: {
                start_ts: startTs,
                progress: 100,
                end_ts: new Date().getTime()
            }
        };
        await setTaskLog(payload)
        console.log(code);
        console.log(cmd);
        reslove(payload)
    }, function(data) {
        console.log('stdout')
        console.log(data.toString('utf-8'))
      },  function(data) {
        console.log('stderr')
        console.log(data.toString('utf-8'))
      } );
  
    });
}

exec({
    fpath: '/home/everthis/projects/pt-task/public/downloads/Deadpool.2.2018.The.Super.Duper.Cut.720p.BluRay.x264.DTS-HDChina.mp4',
    hash:'832094978fae1dd5f2991cea99b55dab74405c3d'
})