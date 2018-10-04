require("dotenv").config();
const wrapper = require("./wrapper");
const { HDR_LOGIN_URL } = require("../util/constant");
const HDR_USERNAME = process.env.HDR_USERNAME;
const HDR_PASSWORD = process.env.HDR_PASSWORD;

async function login(page) {
  await page.evaluate(
    (u, p) => {
      document.querySelector("#username").value = u;
      document.querySelector("#password").value = p;
      document.querySelector("#login-submit").click();
    },
    HDR_USERNAME,
    HDR_PASSWORD
  );
}

async function tothegloryLogin() {
  return wrapper({
    loginUrl: HDR_LOGIN_URL,
    loginAction: login
  });
}
module.exports = tothegloryLogin;
