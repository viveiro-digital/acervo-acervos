import { test, expect } from '@playwright/test';

test('as notas descrevem a amostra sem exibir a imagem da obra', async ({ page }) => {
  for (const id of ['casca', 'diseno-nacional']) {
    await page.goto(`/acervos/${id}/`);
    const cover = page.locator('.record-hero img');
    await expect(cover).toBeVisible();
    await expect(cover).toHaveAttribute('width', /\d+/);
    await page.getByText('Notas e fontes', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'O que conferimos' })).toBeVisible();
    await expect(page.locator('.record-notes-body').getByText(/Ficha.*(imagem|cartaz)/i)).toBeVisible();
    await expect(page.locator('.record-notes img')).toHaveCount(0);
  }
});

test('a página abre com a capa da coleção e os detalhes ficam recolhidos', async ({ page }) => {
  await page.goto('/acervos/irohin/');
  await expect(page.locator('.record-head .collection-cover img')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explorar a coleção' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fontes consultadas' })).toBeHidden();
  await page.getByText('Notas e fontes', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Fontes consultadas' })).toBeVisible();
  await expect(page.locator('.plate--image')).toHaveCount(0);
});


test('o registro mostra a captura ampliável e aponta para a página de origem', async ({ page }) => {
  await page.goto('/acervos/biblioteca-de-zines/');
  const view = page.getByRole('figure', { name: 'Vista da coleção' });
  const screenshot = view.getByRole('img');
  await expect(screenshot).toBeVisible();
  await screenshot.scrollIntoViewIfNeeded();
  await expect.poll(() => screenshot.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(900);
  await expect(view.getByRole('link', { name: /Ampliar captura/ })).toHaveAttribute('href', /biblioteca-de-zines-detalhe\.jpg$/);
  await expect(view.getByRole('link', { name: /Ver esta página no acervo/ }))
    .toHaveAttribute('href', 'https://www.biblioteca-de-zines.com.br/zines');
});
