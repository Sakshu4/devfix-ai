import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:5173/technologies');
  await page.screenshot({ path: 'desktop.png' });

  await page.setViewport({ width: 500, height: 800 });
  await page.screenshot({ path: 'mobile.png' });
  
  await browser.close();
  console.log("Done");
})();
