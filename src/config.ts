export const PORT = process.env.PORT ? +process.env.PORT : 3000;
export const CHROME_PATH = process.env.CHROME_PATH || undefined;
export const PUPPETEER_POOL_LIMIT = process.env.PUPPETEER_POOL_LIMIT ? +process.env.PUPPETEER_POOL_LIMIT : 2;