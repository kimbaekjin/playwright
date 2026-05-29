// tests/api/capture.spec.ts
import { test } from '@playwright/test';
import { SearchPage } from '../../src/pages/search.page';

test('테스트', async ({ page }) => {
  const searchPage = new SearchPage(page);
  
  // 1. 레코딩 활성화
  await searchPage.recorder.startRecording();
  
  // 2. 페이지 이동
  await searchPage.navigate('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=dmatlrwja&ackey=nrogjyxh');
  
  // 3. 테스트가 끝나지 않고 대기 (사용자가 브라우저를 닫을 때까지)
  console.log("레코딩이 시작되었습니다. 브라우저에서 버튼을 클릭하세요. 테스트 종료 시 브라우저를 닫으세요.");
  await page.waitForTimeout(600000); // 10분간 대기 (필요시 더 늘리세요)
});