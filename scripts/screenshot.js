const puppeteer = require('puppeteer');
const fs = require('fs');
(async ()=>{
  const url = process.argv[2] || 'http://localhost:5173/';
  const out = process.argv[3] || 'tmp_screenshot.png';
  try {
    const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({width:1280, height:900});
    const resp = await page.goto(url, {waitUntil: 'networkidle2', timeout: 30000});
    if (!resp) console.warn('No response object from page.goto');
    // capture console messages
    const logs = [];
    page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
    await page.waitForTimeout(500); // brief pause for any deferred logs
    await page.screenshot({path: out, fullPage: true});
    console.log('SCREENSHOT_SAVED:' + out);
    if (logs.length) {
      console.log('PAGE_CONSOLE_LOGS:\n' + logs.join('\n'));
    }
    await browser.close();
  } catch (err) {
    console.error('ERROR:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
