import { test } from '@playwright/test';

test('save login state', async ({ page }) => {
  await page.goto('https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/');

  await page.fill('#id', 'nvqa_place28');
  await page.fill('#pw', 'test123');
  await page.click('button');

  // 로그인 상태 저장
  await page.context().storageState({
    path: 'auth/login.json'
  });
});