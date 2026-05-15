import { Page, Locator, expect, Response } from '@playwright/test';

/**
 * API + click 동기화 (기본)
 */
export async function clickAndWaitResponse(
  page: Page,
  button: Locator,
  urlPart: string
): Promise<Response> {
  const [response] = await Promise.all([
    page.waitForResponse(res =>
      res.url().includes(urlPart) &&
      res.status() === 200
    ),
    button.click()
  ]);

  return response;
}

/**
 * API + UI까지 같이 보장 (실무용)
 */
export async function clickAndWaitUI(
  page: Page,
  button: Locator,
  urlPart: string,
  resultLocator: Locator
) {
  await Promise.all([
    page.waitForResponse(res =>
      res.url().includes(urlPart) &&
      res.status() === 200
    ),
    button.click()
  ]);

  await expect(resultLocator).toBeVisible();
}

/**
 * GraphQL 전용 wait (네이버/SPA 대응)
 */
export async function waitGraphQL(
  page: Page,
  keyword = 'graphql'
): Promise<Response> {
  return page.waitForResponse(res =>
    res.url().includes(keyword) &&
    res.status() === 200
  );
}