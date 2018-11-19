const Rsync = require("rsync");
const path = require("path");
const pwdfile = path.join(__dirname, "..", ".vultr");
// Build the command
const rsync = new Rsync()
  .shell("ssh")
  .flags("az")
  .progress()
  .source(
    "everthis@108.61.246.78:/home/everthis/projects/pt-task/public/downloads/Moana.2016.BluRay.720p.x264.DTS-HDChina.mp4"
  )
  .destination("/home/everthis/downloads/");

// Execute the command
rsync.execute(function(err, code, cmd) {
  // we're done
  if (err) {
    console.log("---err---", err);
  }

  console.log(code);
  console.log(cmd);
});
