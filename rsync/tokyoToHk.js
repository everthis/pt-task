require("dotenv").config();
const Rsync = require("rsync");
const path = require("path");
const fs = require("fs");
const bull = require("bull");
const setTaskLog = require("../util/setTaskLog");
const { REDIS_HOST_PORT, TOKYO_USER_HOST } = process.env;
const rsyncQueue = new bull("pt-task-rsync", REDIS_HOST_PORT);

rsyncQueue.process(job => {
  const { fpath, hash } = job.data;
  const startTs = new Date().getTime();
  let speedCpt = "";
  return new Promise((reslove, reject) => {
    // Build the command
    // set --info=progress2 or --no-inc-recursive may help
    const rsync = new Rsync()
      .set("info", "progress2")
      .set("remove-source-files")
      .shell("ssh")
      .flags("az")
      .progress()
      .source(`${TOKYO_USER_HOST}:${fpath}`)
      .destination(fpath);

    // Execute the command
    rsync.execute(
      async (err, code, cmd) => {
        // we're done
        if (err) {
          console.log("---err---", err);
          reject(err);
        }
        const payload = {
          hash,
          step: "rsync",
          log: {
            start_ts: startTs,
            progress: 100,
            speed: speedCpt,
            end_ts: new Date().getTime()
          }
        };
        await setTaskLog(payload);
        reslove();
        console.log(code);
        console.log(cmd);
      },
      async data => {
        const str = data.toString("utf-8");
        const arr = str.trim().split(" ");
        if (arr.length > 5) {
          const d = arr.filter(el => el.length > 0);
          const progress = +d[1].split("%")[0];
          const speed = (speedCpt = d[2]);
          const payload = {
            hash,
            step: "rsync",
            log: {
              start_ts: startTs,
              progress,
              speed,
              end_ts: new Date().getTime()
            }
          };
          await setTaskLog(payload);
        }
      },
      function(data) {
        console.log(data.toString("utf-8"));
      }
    );
  });
});

async function rsyncFn({ fpath, hash }) {
  return await rsyncQueue.add({ fpath, hash });
}

module.exports = rsyncFn;
