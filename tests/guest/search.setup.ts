import { test, expect } from '@playwright/test';
import { NaverSearchPage } from '../../pages/naverSearch.page';

test.describe('guest 상태 - 네이버 검색 테스트', () => {

  test.use({
    storageState: undefined
  });

  test('음식점 검색 + 필터 적용', async ({ page }) => {

    const naver = new NaverSearchPage(page);

    await naver.open();

    await naver.search('음식점');

    await naver.applyPlaceFilters([
      '한식',
      '주차'
    ]);
    await expect(page.locator('body')).toBeVisible();
  });
});