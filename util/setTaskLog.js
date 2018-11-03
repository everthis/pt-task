const fetch = require("node-fetch");
const { stringify } = JSON;

async function setTaskLog(payload) {
  return await fetch("http://localhost:8678/set_pt_task_log", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: stringify(payload)
  }).then(r => r.json());
}

module.exports = setTaskLog;
