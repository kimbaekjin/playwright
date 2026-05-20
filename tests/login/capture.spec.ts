import { test } from '@playwright/test';
import { SearchPage } from '@pages/search.page';
import data from '@data/searchData.json';

test.describe('data driven search test', () => {

  test.setTimeout(120000);

  for (const keyword of data) {

    test(`search: ${keyword}`, async ({ page }) => {

      const search = new SearchPage(page);

      await page.goto(process.env.BASE_URL!);

      await search.search(keyword);

      await search.captureResult(keyword);

    });

  }

});