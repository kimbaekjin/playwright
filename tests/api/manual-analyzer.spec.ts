import { test } from '@playwright/test';
import { ManualInterceptor } from '@api/manual-analyzer'; 

test('수동 클릭 캡처 실행', async ({ page }) => {
  const interceptor = new ManualInterceptor(page);
  
  // 레코딩 시작
  await interceptor.startRecording();

  // 검색 페이지 접속
  await page.goto('https://search.naver.com/search.naver?where=nexearch&query=%EC%9D%8C%EC%8B%9D%EC%A0%90');

  // 브라우저가 꺼지지 않고 수동 조작을 기다림
  await page.pause(); 
});