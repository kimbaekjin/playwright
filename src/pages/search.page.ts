// src/pages/search.page.ts
import { Page } from '@playwright/test';
import { NetworkRecorder } from '../api/network.recorder';

export class SearchPage {
  readonly page: Page;
  readonly recorder: NetworkRecorder;

  constructor(page: Page) {
    this.page = page;
    this.recorder = new NetworkRecorder(page);
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }
}