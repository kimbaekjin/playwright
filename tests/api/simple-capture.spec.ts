import { test } from '@playwright/test';
import { ApiAnalyzer } from '../../src/api/api-analyzer-util';

test('어떤 버튼을 눌러도 다 저장한다', async ({ page }) => {
  await ApiAnalyzer.setup(page, './logs/my-clicks');
  
  await page.goto('https://stg.map.naver.com/p/search/음식점');
  
  console.log('🛑 클릭하는 대로 모든 로그가 폴더에 저장됩니다. 마음껏 누르세요!');
  await page.pause(); // 조작 완료 후 직접 브라우저 종료
});