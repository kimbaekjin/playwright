// tests/login/search.spec.ts
import { test, expect } from '../../fixtures/baseFixture'; // 우리가 만든 픽스처 가져오기

test.describe('login 상태 - 네이버 검색 테스트', () => {
  // config에서 'logged-in-tests' 프로젝트로 실행하면 
  // storageState가 자동으로 적용되므로 테스트 파일엔 적을 필요가 없습니다!

  test('음식점 검색 + 필터 적용', async ({ naverPage, page }) => {
    await naverPage.open();
    await naverPage.search('음식점');
    await naverPage.applyPlaceFilters(['한식', '주차']);
    
    await expect(page.locator('body')).toBeVisible();
  });
});