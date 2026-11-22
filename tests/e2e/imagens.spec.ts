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
