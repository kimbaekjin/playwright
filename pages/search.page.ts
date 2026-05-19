import { Page, expect } from '@playwright/test';

export class SearchPage {
  constructor(private readonly page: Page) {}

  private get searchInput() {
    return this.page.locator('#nx_query');
  }

  private get searchButton() {
    return this.page.locator('.bt_search');
  }

  private get resultArea() {
    return this.page.locator('#place-main-section-root');
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();

    // 결과 영역 뜰 때까지 대기 (핵심)
    await expect(this.resultArea).toBeVisible();
  }

  async captureResult(name: string) {
    await this.resultArea.screenshot({
      path: `screenshots/${name}.png`
    });
  }
}