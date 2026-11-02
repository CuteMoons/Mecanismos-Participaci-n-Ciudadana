const chromium = require('@sparticuz/chromium').default || require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
module.exports = async () => {
  const path = await chromium.executablePath();
  return puppeteer.launch({ executablePath: path, args: [...chromium.args, '--allow-file-access-from-files'], headless: 'shell' });
};
