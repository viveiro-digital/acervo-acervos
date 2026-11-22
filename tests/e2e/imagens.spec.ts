import { test, expect } from '@playwright/test';

test('imagens licenciadas: proporção preservada, alt, dimensões e crédito', async ({ page }) => {
  for (const id of ['casca', 'diseno-nacional']) {
    await page.goto(`/acervos/${id}/`);
    await page.getByText('Notas e fontes', { exact: true }).click();
    const img = page.locator('.plate--image img').first();
    await img.evaluate((image: HTMLImageElement) => { image.loading = 'eager'; return image.decode(); });
    await expect(img).toHaveAttribute('alt', /.+/);
    await expect(img).toHaveAttribute('width', /\d+/);
    await expect(img).toHaveAttribute('height', /\d+/);
    const ok = await img.evaluate((i: HTMLImageElement) => {
      const r = i.getBoundingClientRect();
      return Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) < 0.02;
    });
    expect(ok).toBe(true);
    await expect(page.locator('.plate--image figcaption')).toContainText(/CC/);
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
