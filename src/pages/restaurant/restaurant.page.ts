import { Page, expect, Locator } from '@playwright/test';
import { clickAndWaitResponse } from '../../utils/wait';

export class restaurantPage {
  // 생성자에서 private page를 선언하면 this.page로 바로 접근 가능합니다.
  constructor(private readonly page: Page) {}

  // 1. 하드코딩된 URL 제거: 생성자에서 가져올 필요 없이 자동 설정된 baseURL을 사용
  async open() {
    await this.page.goto('/'); // '/'만 입력하면 playwright.config.ts의 baseURL로 이동
  }

  // 2. 자주 사용하는 Locator를 속성으로 정의 (가독성 향상)
  private get searchInput() { return this.page.getByRole('combobox', { name: '검색어를 입력해 주세요' }); }
  private get searchButton() { return this.page.getByRole('button', { name: '검색', exact: true }); }
  private get filterBtn() { return this.page.getByRole('button', { name: '전체필터' }); }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);

    // API 통신을 기다리는 유틸리티 함수 유지
    await clickAndWaitResponse(this.page, this.searchButton, 'graphql');

    await expect(this.filterBtn).toBeVisible();
    await this.filterBtn.click();
  }

  async applyPlaceFilters(options: string[]) {
    // 3. Locator 범위를 명확히 지정: 
    // 가능하다면 data-testid 등을 사용하는 것이 대기업의 표준입니다.
    const panel = this.page.locator('.J2cKR.cZguM.WNLhr'); 
    await expect(panel).toBeVisible();

    for (const option of options) {
      const item = panel.getByRole('button', { name: option });
      // 4. 로직의 안정성 강화: 스크롤 후 대기 추가
      await item.scrollIntoViewIfNeeded();
      await item.click();
    }

    const resultBtn = this.page.getByRole('button', { name: '결과보기' });
    await expect(resultBtn).toBeVisible();
    await resultBtn.click();
  }
}