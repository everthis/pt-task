const fetch = require("node-fetch");
const { stringify } = JSON;
const isLocal = process.env.NODE_ENV === "production" ? false : true;

let origin = "";
if (isLocal) {
  origin = "http://localhost:8678";
} else {
  origin = "https://www.everthis.com";
}
async function setTaskLog(payload) {
  return await fetch(`${origin}/set_pt_task_log`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: stringify(payload)
  }).then(r => r.json());
}

module.exports = setTaskLog;
