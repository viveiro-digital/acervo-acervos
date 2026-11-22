import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const paginas = [
  '/', '/comparar/?ids=casca,irohin', '/sobre/', '/metodologia/', '/contribuir/',
  '/acervos/casca/', '/acervos/diseno-nacional/', '/acervos/irohin/', '/acervos/museu-kuahi/',
];

for (const p of paginas) {
  test(`axe (WCAG 2.2 AA): ${p}`, async ({ page }) => {
    await page.goto(p);
    const r = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test('axe no painel aberto', async ({ page }) => {
  await page.goto('/');
  await page.locator('a[data-open="casca"]').click();
  await expect(page.locator('#painel-titulo')).toBeVisible();
  const r = await new AxeBuilder({ page }).include('#painel').analyze();
  expect(r.violations).toEqual([]);
});

test('teclado: primeiro Tab vai para o link de pular conteúdo', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
});
