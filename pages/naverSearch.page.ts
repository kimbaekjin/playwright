import { Page, expect } from '@playwright/test';
import { clickAndWaitResponse } from '../utils/wait';

export class NaverSearchPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('https://www.naver.com/');
  }

  async search(keyword: string) {
    const input = this.page.getByRole('combobox', {
      name: '검색어를 입력해 주세요'
    });

    const searchButton = this.page.getByRole('button', {
      name: '검색',
      exact: true
    });

    await input.fill(keyword);

    // 🔥 핵심: API sync
    await clickAndWaitResponse(
      this.page,
      searchButton,
      'graphql' // ← 실제 네트워크 기준으로 바꾸면 됨
    );

    const filterBtn = this.page.getByRole('button', {
         name: '전체필터'
    });

    await filterBtn.waitFor();   // 핵심 안정화
    await filterBtn.click();
  }
}