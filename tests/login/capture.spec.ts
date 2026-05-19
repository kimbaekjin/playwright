import { test } from '@playwright/test';
import { SearchPage } from '@pages/search.page';
import data from '@data/searchData.json';

test.describe('data driven search test', () => {

  for (const item of data) {

    test(`search: ${item.keyword}`, async ({ page }) => {

      const search = new SearchPage(page);

      await page.goto(process.env.BASE_URL!);

      await search.search(item.keyword);

      await search.captureResult(item.keyword);

    });

  }

});