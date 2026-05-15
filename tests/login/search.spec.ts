import { test } from '@playwright/test';
import { NaverSearchPage } from '../../pages/naverSearch.page';

test.describe('login 상태', () => {

  test.use({
    storageState: 'auth/login.json'
  });

  test('음식점 검색', async ({ page }) => {
    const naver = new NaverSearchPage(page);

    await naver.open();
    await naver.search('음식점');
  });
});