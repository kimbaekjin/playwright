import { chromium } from '@playwright/test';

export default async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://nid.naver.com/nidlogin.login?mode=form');

  await page.fill('#id', process.env.NAVER_ID!);
  await page.fill('#pw', process.env.NAVER_PASSWORD!);
  await page.click('#log\\.login');

  await page.waitForURL('https://www.naver.com/**');

  await context.storageState({
    path: 'auth/login.json'
  });

  await browser.close();
};