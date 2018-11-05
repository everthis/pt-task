require("dotenv").config();
const wrapper = require("./wrapper");
const { TTG_LOGIN_URL } = require("../util/constant");
const { TTG_USERNAME, TTG_PASSWORD } = process.env;

async function login(page) {
  await page.evaluate(
    (u, p) => {
      document.querySelector("#login-name").value = u;
      document.querySelector("#login-pass").value = p;
      document.querySelector("input[type=submit]").click();
    },
    TTG_USERNAME,
    TTG_PASSWORD
  );
}

async function tothegloryLogin() {
  return wrapper({
    loginUrl: TTG_LOGIN_URL,
    loginAction: login
  });
}
module.exports = tothegloryLogin;
