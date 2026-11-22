import { test, expect } from '@playwright/test';

test('imagens licenciadas: proporção preservada, alt, dimensões e crédito', async ({ page }) => {
  for (const id of ['casca', 'diseno-nacional']) {
    await page.goto(`/acervos/${id}/`);
    const img = page.locator('.plate--image img').first();
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

test('sem imagem autorizada: prancha tipográfica explica a ausência', async ({ page }) => {
  await page.goto('/acervos/irohin/');
  await expect(page.locator('.plate--type')).toBeVisible();
  await expect(page.locator('.plate--type .pt-note')).not.toBeEmpty();
  await expect(page.locator('main img')).toHaveCount(0);
});
