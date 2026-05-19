// fixtures/baseFixture.ts
import { test as base } from '@playwright/test';
import { NaverSearchPage } from '../pages/naverSearch.page';

// 픽스처 타입 정의
type MyFixtures = {
  naverPage: NaverSearchPage;
};

// 픽스처 확장
export const test = base.extend<MyFixtures>({
  // 페이지 객체를 매번 new 할 필요 없이 픽스처로 주입
  naverPage: async ({ page }, use) => {
    const naver = new NaverSearchPage(page);
    await use(naver);
  },
});

export { expect } from '@playwright/test';