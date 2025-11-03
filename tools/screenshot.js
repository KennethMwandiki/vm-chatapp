const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = process.argv[2] || 'http://localhost:5173/';
  const out = process.argv[3] || 'tmp_screenshot.png';

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.text()));

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.setViewport({ width: 1200, height: 900 });
  await page.screenshot({ path: out, fullPage: true });

  await browser.close();
  fs.writeFileSync('tmp_screenshot_console.txt', consoleMessages.join('\n'));
  console.log('screenshot saved to', out);
})();
