require("dotenv").config();
const wrapper = require("./wrapper");
const { HDC_LOGIN_URL } = require("../util/constant");
const HDC_USERNAME = process.env.HDC_USERNAME;
const HDC_PASSWORD = process.env.HDC_PASSWORD;

async function login(page) {
  await page.evaluate(
    (u, p) => {
      document.querySelector("#username").value = u;
      document.querySelector("#password").value = p;
      document.querySelector("#login-submit").click();
    },
    HDC_USERNAME,
    HDC_PASSWORD
  );
}

async function tothegloryLogin() {
  return wrapper({
    loginUrl: HDC_LOGIN_URL,
    loginAction: login
  });
}
module.exports = tothegloryLogin;
