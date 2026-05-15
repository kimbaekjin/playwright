import { Page } from '@playwright/test';

export class NaverSearchPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('https://www.naver.com/');
  }

  async search(keyword: string) {
    await this.page
      .getByRole('combobox', { name: '검색어를 입력해 주세요' })
      .fill(keyword);

    await this.page.getByRole('button', { name: '검색', exact: true }).click();

    const page1Promise = this.page.waitForEvent('popup');
    await this.page.getByRole('button', { name: '신규장소 등록' }).click();
    const page1 = await page1Promise;
    await page1.getByRole('button', { name: '확인' }).click();
  }
}