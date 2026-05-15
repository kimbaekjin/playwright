import { test, expect } from '@playwright/test';
import { NaverSearchPage } from '../../pages/naverSearch.page';

test.describe('guest 상태', () => {

  test.use({
    storageState: undefined
  });

  test('음식점 검색', async ({ page }) => {
    const naver = new NaverSearchPage(page);

    await naver.open();
    await naver.search('음식점');
  });
});