import { test } from '@playwright/test';
import { NaverInterceptor } from '../../src/api/interceptor';

test('검색 후 필터 버튼 조작 및 데이터 캡처', async ({ page }) => {
  const interceptor = new NaverInterceptor(page);
  
  // 1. 검색 페이지 이동
  await page.goto('https://search.naver.com/search.naver?where=nexearch&query=%EC%9D%8C%EC%8B%9D%EC%A0%90');

  // 2. '필터' 버튼 클릭 (선택자는 실제 네이버 상황에 맞춰 수정 필요)
  await interceptor.listenAndCapture('필터_버튼');
  await page.click('button.btn_filter'); // 예시 선택자
  await page.waitForTimeout(2000);

  // 3. '영업중' 버튼 클릭
  await interceptor.listenAndCapture('영업중_버튼');
  await page.click('button.btn_open'); // 예시 선택자
  await page.waitForTimeout(2000);
});