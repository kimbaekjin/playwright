import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.naver.com/');
  await page.getByRole('combobox', { name: '검색어를 입력해 주세요' }).click();
  await page.getByRole('combobox', { name: '검색어를 입력해 주세요' }).fill('음식점');
  await page.getByRole('combobox', { name: '검색어를 입력해 주세요' }).press('Enter');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '전체필터' }).click();
  await page.getByRole('button', { name: '영업중' }).first().click();
  await page.getByRole('button', { name: '전체 필터 레이어 닫기' }).click();
});