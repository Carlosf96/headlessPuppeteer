const puppeteer = require('puppeteer');

function run(pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1;
      }
      const browser = await puppeteer.launch({
        userDataDir: './data'
      });
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.resourceType() === 'document') {
          req.continue();
        } else {
          req.abort();
        }
      })
      await page.goto('https://holacode.com/');
      let currentPage = 1;
      let urls = [];
      while (currentPage <= pagesToScrape) {
        let newUrls = await page.evaluate(() => {
          let results = [];
          let items = document.querySelectorAll('p');
          items.forEach((i) => {
            let words = i.innerText.split(' ').filter((e) => e == "Mexican");
            results.push({
              text: words
            });
          });
          return results;
        })
        urls = urls.concat(newUrls);
        if (currentPage < pagesToScrape) {
          await Promise.all([
            await page.click('a.morelink'),
            await page.waitForSelector('a.storylink')
          ])
        }
        currentPage++;
      }
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e)
    }
  })
}

run().then(console.log).catch(console.error);