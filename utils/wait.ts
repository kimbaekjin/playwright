export async function waitGraphQL(page, keyword = 'graphql') {
  await page.waitForResponse(res =>
    res.url().includes(keyword) &&
    res.status() === 200
  );
}