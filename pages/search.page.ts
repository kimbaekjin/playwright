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
    return this.page
      .locator('#place-main-section-root')
      .or(
        this.page.locator('#loc-main-section-root')
      )
      .first();
  }

  async search(keyword: string) {
    await this.executeSearch(keyword);

    await this.waitForResult(keyword);
  }

  private async executeSearch(keyword: string) {
    await this.searchInput.waitFor({
      state: 'visible'
    });

    await this.searchInput.fill(keyword);

    await this.searchButton.click();
  }

  private async waitForResult(keyword: string) {
    while (true) {
      try {
        await expect(
          this.resultArea
        ).toBeVisible({
          timeout: 3000
        });

        console.log('결과 영역 노출 완료');

        return;
      } catch {
        console.log(
          '결과 영역 미노출 → 새로고침 후 재검색'
        );

        await this.page.reload({
          waitUntil: 'domcontentloaded'
        });

        await this.executeSearch(keyword);
      }
    }
  }

  async captureResult(name: string) {
    await expect(
      this.resultArea
    ).toBeVisible();

    await this.resultArea.screenshot({
      path: `screenshots/${name}.png`
    });
  }
}