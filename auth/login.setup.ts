import { test as setup, expect } from '@playwright/test';
// 일반 test 대신 setup이라는 이름으로 가져와서, 이 파일이 '설정용'임을 명확히 합니다.

setup('save login state', async ({ page }) => {
  // 1. 환경 변수 가져오기 및 안전성 검사 (Fail Fast)
  const userId = process.env.NAVER_ID;
  const userPw = process.env.NAVER_PASSWORD;

  if (!userId || !userPw) {
    throw new Error('환경 변수 오류: .env 파일에 NAVER_ID 또는 NAVER_PASSWORD가 없습니다.');
  }

  // 2. 로그인 페이지 이동
  await page.goto('https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/');

  // 3. 보안 정보 입력 (하드코딩 제거)
  await page.fill('#id', userId);
  await page.fill('#pw', userPw);
  await page.locator('#log\\.login').click();

  // 4. 로그인 완료 대기
  await page.waitForURL('https://www.naver.com/**');

  // 5. 세션 상태(쿠키 등) 저장
  await page.context().storageState({
    path: 'auth/login.json'
  });
  
  console.log('로그인 세션 저장 완료 (auth/login.json)');
});