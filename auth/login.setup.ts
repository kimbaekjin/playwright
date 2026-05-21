import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../auth/login.json');

setup('authenticate', async ({ page }) => {
  // 파일이 존재하고, 12시간 이내라면 아무것도 안 하고 종료
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    if (new Date().getTime() - stats.mtimeMs < 12 * 60 * 60 * 1000) {
      console.log('✅ 기존 로그인 세션 재사용');
      return;
    }
  }

  // 세션이 없으면 로그인 수행
  await page.goto('https://nid.naver.com/nidlogin.login?mode=form');
  await page.fill('#id', process.env.NAVER_ID!);
  await page.fill('#pw', process.env.NAVER_PASSWORD!);
  await page.click('#log\\.login');
  
  // 로그인 성공 여부 확인 (네이버 메인으로 이동하는지 확인)
  await page.waitForURL('https://www.naver.com/**');
  
  await page.context().storageState({ path: authFile });
});