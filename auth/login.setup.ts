import { test } from '@playwright/test';

test('save login state', async ({ page }) => {

  await page.goto(
    'https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/'
  );

  await page.fill('#id', 'nvqa_place28');
  await page.fill('#pw', 'qatest123');

  await page.getByRole('button', { name: '로그인' }).click();

  // 🔥 로그인 완료까지 기다림
  await page.waitForURL('https://www.naver.com/**');

  // 🔥 state 저장
  await page.context().storageState({
    path: 'auth/login.json'
  });
});