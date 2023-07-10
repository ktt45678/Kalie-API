import puppeteer from 'puppeteer';
import { URL } from 'url';
import path from 'path';

import { CreateImageDto } from './dto/index.js';
import { CHROME_PATH } from '../../config.js';

export interface CreateImageResult {
  name: string;
  url: string;
}

export class ClipDropService {
  async createImages(createImageDto: CreateImageDto) {
    const { prompt, style } = createImageDto;

    const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
    const page = await browser.newPage();

    await page.goto('https://clipdrop.co/stable-diffusion');

    // Set screen size
    await page.setViewport({ width: 1280, height: 720 });

    // Input prompt
    const promptInputSelector = await page.waitForSelector('#initml-layout_content > main form input[name=prompt]');
    await promptInputSelector?.click();
    await promptInputSelector?.evaluate((el, prompt) => el.value = prompt, prompt);

    // Style selector
    if (style) {
      const styleButtonSelector = await page.$('#initml-layout_content > main form button[type=button]');
      if (styleButtonSelector) {
        await styleButtonSelector.click();
        await page.waitForSelector('#initml-layout_content > main form button[type=button]:has(>img + p)');
        const styleSelectButtons = await page.$$('#initml-layout_content > main form button[type=button]:has(>img + p)');
        for (let i = 0; i < styleSelectButtons.length; i++) {
          const styleName = await styleSelectButtons[i].evaluate(el => el.textContent);
          if (!styleName) continue;
          const normalizedStyle = styleName.replace(/\s/g, '').toLowerCase();
          if (normalizedStyle !== style) continue;
          await styleSelectButtons[i].click();
          break;
        };
      }
    }

    // Submit button
    const submitButtonSelector = await page.$('#initml-layout_content > main form button[type=submit]');
    await submitButtonSelector?.click();

    const createdFiles = await new Promise<CreateImageResult[]>((resolve) => {
      let totalResponses = 0;
      let collectedFiles: CreateImageResult[] = [];
      const writeFileController = new AbortController();
      // Timeout
      const endTimeout = setTimeout(() => {
        writeFileController.abort();
        resolve(collectedFiles);
      }, 120_000);
      // Detect response
      page.on('response', async (response) => {
        const url = response.url();
        const headers = response.headers();
        if (!url.startsWith('https://firebasestorage.googleapis.com'))
          return;
        if (!headers['content-type'] || !headers['content-type'].startsWith('image/'))
          return;
        const parsedUrl = new URL(url);
        const fileName = path.basename(parsedUrl.pathname);
        // Process file
        const fileBuffer = await response.buffer();
        totalResponses++;
        collectedFiles.push({
          name: fileName,
          url: `data:${headers['content-type']};base64,${fileBuffer.toString('base64')}`
        });
        // Check collected files
        if (totalResponses >= 4) {
          clearTimeout(endTimeout);
          resolve(collectedFiles);
        }
      });
    });

    await browser.close();

    return createdFiles;
  }
}

export const clipdropService = new ClipDropService();