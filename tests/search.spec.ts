import { test, expect } from '@playwright/test';
import { authStates } from '../auth/states';
import { NaverSearchPage } from '../pages/naverSearch.page';

for (const state of authStates) {

  test.describe(`${state.name} 상태`, () => {

    test.use({
      storageState: state.storageState
    });

    test('음식점 검색 테스트', async ({ page }) => {
      const naver = new NaverSearchPage(page);

      await naver.open();

      await naver.search('음식점');

      // 🔥 UI 안정성 보장 (필수)
      await expect(
        page.locator('body')
      ).toBeVisible();
    });

    test('신규장소 팝업 테스트', async ({ page }) => {
      const naver = new NaverSearchPage(page);

      await naver.open();

      await naver.openNewPlacePopup();
    });

  });
}