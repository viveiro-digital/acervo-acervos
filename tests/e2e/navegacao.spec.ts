import { test, expect } from '@playwright/test';

test('explorar: filtros refletem na URL e escondem itens', async ({ page }) => {
  await page.goto('/explorar/?pais=AR');
  const visiveis = page.locator('#lista > li:visible');
  await expect(visiveis).toHaveCount(1);
  await expect(page.locator('#contagem')).toContainText('1 de');
});

test('explorar: busca ignora acentos', async ({ page }) => {
  await page.goto('/explorar/');
  await page.fill('#q', 'amapa');
  await expect(page).toHaveURL(/q=amapa/);
  const resultados = page.locator('#lista > li:visible');
  await expect(resultados).toHaveCount(2);
  await expect(resultados.first()).toHaveAttribute('data-id', 'museu-kuahi');
  await expect(resultados.last()).toHaveAttribute('data-id', 'biblioteca-de-zines');
});

test('explorar: remover chip limpa o filtro', async ({ page }) => {
  await page.goto('/explorar/?q=cartaz&acesso=abre-direto');
  await page.locator('#chips button').first().click();
  await expect(page).toHaveURL(/\/explorar\/\?acesso=abre-direto$/);
});

test('painel: abre com URL canônica, navega e fecha com Esc e voltar', async ({ page }) => {
  await page.goto('/explorar/?pais=BR');
  await page.locator('a[data-open="irohin"]').click();
  await expect(page.locator('#painel')).toHaveAttribute('open', '');
  await expect(page).toHaveURL(/\/acervos\/irohin\/$/);
  await expect(page.locator('#painel-titulo')).toBeFocused();
  await page.locator('[data-panel="next"]').click();
  await expect(page).toHaveURL(/\/acervos\/museu-kuahi\/$/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#painel')).not.toHaveAttribute('open', '');
  await expect(page).toHaveURL(/\/explorar\/\?pais=BR$/);
  await page.goForward();
  await expect(page.locator('#painel')).toHaveAttribute('open', '');
  await page.goBack();
  await expect(page.locator('#painel')).not.toHaveAttribute('open', '');
  await expect(page.locator('#f-pais')).toHaveValue('BR');
});

test('registro: URL direta funciona e tem h1 único', async ({ page }) => {
  const res = await page.goto('/acervos/casca/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Arquivo CASCA');
});

test('comparar: no máximo 4 registros', async ({ page }) => {
  await page.goto('/comparar/?ids=casca,irohin,museu-kuahi,cartel-mexico,tipomap-latam');
  await expect(page.locator('thead th[data-col]:visible')).toHaveCount(4);
});

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('explorar lista tudo e o link abre a página do registro', async ({ page }) => {
    await page.goto('/explorar/?pais=AR');
    await expect(page.locator('#lista > li')).toHaveCount(12);
    await page.locator('a[data-open="casca"]').click();
    await expect(page).toHaveURL(/\/acervos\/casca\/$/);
  });
});

test('explorar: consulta em espanhol encontra seção com relevância', async ({ page }) => {
  await page.goto('/explorar/?q=carteles+politicos');
  await expect(page.locator('#lista > li:visible').first()).toHaveAttribute('data-id', 'diseno-nacional');
});

test('explorar: busca o conteúdo catalogado e tolera erro de digitação', async ({ page }) => {
  await page.goto('/explorar/?q=Carlos+Moura');
  await expect(page.locator('#lista > li:visible').first()).toHaveAttribute('data-id', 'irohin');
  await page.fill('#q', 'bibliotcea de zines');
  await expect(page.locator('#lista > li:visible').first()).toHaveAttribute('data-id', 'biblioteca-de-zines');
});
