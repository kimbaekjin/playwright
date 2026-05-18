import { Page, expect } from '@playwright/test';
import { clickAndWaitResponse } from '../utils/wait';

export class NaverSearchPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('https://www.naver.com/');
  }

  // -------------------------
  // 1. 검색 + 전체필터 진입
  // -------------------------
  async search(keyword: string) {
    const input = this.page.getByRole('combobox', {
      name: '검색어를 입력해 주세요'
    });

    const searchButton = this.page.getByRole('button', {
      name: '검색',
      exact: true
    });

    await input.fill(keyword);

    // 🔥 검색 API sync
    await clickAndWaitResponse(
      this.page,
      searchButton,
      'graphql'
    );

    // 🔥 전체필터 진입
    const filterBtn = this.page.getByRole('button', {
      name: '전체필터'
    });

    await expect(filterBtn).toBeVisible();
    await filterBtn.click();
  }

  // -------------------------
  // 2. 필터 선택 + 결과보기
  // -------------------------
    async applyPlaceFilters(options: string[]) {

  const panel = this.page.locator('.J2cKR.cZguM.WNLhr');
  // 👉 핵심: 필터 영역으로 정확히 scope 제한

  await expect(panel).toBeVisible();

  for (const option of options) {

    const item = panel.getByRole('button', {
      name: option
    });

    await item.scrollIntoViewIfNeeded();
    await item.click();
  }

  const resultBtn = this.page.getByRole('button', {
    name: '결과보기'
  });

  await expect(resultBtn).toBeVisible();
  await resultBtn.click();
}
}