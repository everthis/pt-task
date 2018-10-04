require("dotenv").config();
const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const iPhoneX = devices["iPhone X"];

const cookiesArrToStr = require("../util/cookiesArrToStr");

/**
 * use puppeteer to get wanted cookies
 */
async function headlessLogin(payload, ...cbFnArr) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.emulate(iPhoneX)
  await page.goto(payload.loginUrl);

  await payload.loginAction(page);

  await page.waitForNavigation();
  // await page.goto(MY_TTG_PAGE_URL, {
  //   waitUntil: "networkidle0"
  // });
  const cookies = await page.cookies();
  await page.screenshot({ path: "ok.jpg" });
  // execute callback functions if they are passed in.
  // do this procedure before browser.close()
  if (cbFnArr.length) {
    for (let fn of cbFnArr) {
      await fn({ browser, page });
    }
  }
  await browser.close();
  return [cookiesArrToStr(cookies), cookies];
}

module.exports = headlessLogin;
