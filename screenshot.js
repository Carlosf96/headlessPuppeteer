const puppeteer = require('puppeteer');//pull in the puppeteer library

const url = process.argv[2];// assign the first argument for this program to url variable
if(!url) throw 'Please provide a URL as the first argument';//if no arg is passed in then throw this error message

async function bzz () {//async fn
  const browser = await puppeteer.launch();//init our puppeteer
  const page = await browser.newPage();//open new page
  await page.goto(url);//go to the url passed in
  await page.screenshot({ path: 'screenshot.png'});//take screenshot and save as screenshot.png
  browser.close();//close puppeteer broswer session
}
bzz();//execute fn