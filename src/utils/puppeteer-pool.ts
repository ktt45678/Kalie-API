import puppeteer from 'puppeteer';
import genericPool from 'generic-pool';

import { CHROME_PATH, PUPPETEER_POOL_LIMIT } from '../config.js';

const factory = {
  create: function () {
    return puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
  },
  destroy: function (browser: puppeteer.Browser) {
    return browser.close();
  }
};

export const puppeteerPool = genericPool.createPool(factory, {
  max: PUPPETEER_POOL_LIMIT
});