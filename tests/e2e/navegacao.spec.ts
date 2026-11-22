import { test, expect } from '@playwright/test';

test('início: filtros refletem na URL e escondem itens', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filtros', exact: true }).click();
  await page.locator('#f-pais').selectOption('AR');
  await expect(page).toHaveURL(/\/\?pais=AR$/);
  const visiveis = page.locator('#lista > li:visible');
  await expect(visiveis).toHaveCount(2);
  await expect(visiveis.last()).toHaveAttribute('data-id', 'potencia-tortillera');
  await expect(page.locator('#contagem')).toContainText('2 de');
});

test('início: busca ignora acentos', async ({ page }) => {
  await page.goto('/');
  await page.fill('#q', 'amapa');
  await expect(page).toHaveURL(/q=amapa/);
  const resultados = page.locator('#lista > li:visible');
  await expect(resultados).toHaveCount(2);
  await expect(resultados.first()).toHaveAttribute('data-id', 'museu-kuahi');
  await expect(resultados.last()).toHaveAttribute('data-id', 'biblioteca-de-zines');
});

test('início: remover chip limpa o filtro', async ({ page }) => {
  await page.goto('/?q=cartaz&acesso=abre-direto');
  await page.locator('#chips button').first().click();
  await expect(page).toHaveURL(/\/\?acesso=abre-direto$/);
});

test('painel: abre com URL canônica, navega e fecha com Esc e voltar', async ({ page }) => {
  await page.goto('/?pais=BR');
  await page.locator('a[data-open="irohin"]').click();
  await expect(page.locator('#painel')).toHaveAttribute('open', '');
  await expect(page).toHaveURL(/\/acervos\/irohin\/$/);
  await expect(page.locator('#painel-titulo')).toBeFocused();
  await page.locator('[data-panel="next"]').click();
  await expect(page).toHaveURL(/\/acervos\/museu-da-mare\/$/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#painel')).not.toHaveAttribute('open', '');
  await expect(page).toHaveURL(/\/\?pais=BR$/);
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
  test('início lista tudo e o link abre a página do registro', async ({ page }) => {
    await page.goto('/?pais=AR');
    await expect(page.locator('#lista > li')).toHaveCount(18);
    await page.locator('a[data-open="casca"]').click();
    await expect(page).toHaveURL(/\/acervos\/casca\/$/);
  });
});

test('início: consulta em espanhol encontra seção com relevância', async ({ page }) => {
  await page.goto('/?q=carteles+politicos');
  await expect(page.locator('#lista > li:visible').first()).toHaveAttribute('data-id', 'diseno-nacional');
});

test('início: busca o conteúdo catalogado e tolera erro de digitação', async ({ page }) => {
  await page.goto('/?q=Carlos+Moura');
  await expect(page.locator('#lista > li:visible').first()).toHaveAttribute('data-id', 'irohin');
  await page.fill('#q', 'bibliotcea de zines');
  await expect(page.locator('#lista > li:visible').first()).toHaveAttribute('data-id', 'biblioteca-de-zines');
});

test('início: encontra a biblioteca pelo clube e pelo material do Amapá', async ({ page }) => {
  await page.goto('/?q=clube+de+zines');
  const first = page.locator('#lista > li:visible').first();
  await expect(first).toHaveAttribute('data-id', 'biblioteca-de-zines');
  await expect(first).toContainText('enviados por quem os faz');
  await page.goto('/?q=fanzines+do+Amap%C3%A1');
  await expect(first).toHaveAttribute('data-id', 'biblioteca-de-zines');
});

test('o endereço antigo preserva a busca e os filtros no catálogo inicial', async ({ page }) => {
  await page.goto('/explorar/?q=carteles+politicos&pais=CL');
  await expect(page).toHaveURL(/\/\?q=carteles\+politicos&pais=CL$/);
  await expect(page.locator('#lista > li:visible').first()).toHaveAttribute('data-id', 'diseno-nacional');
});

test('buscar e abrir um acervo rapidamente mantém a busca ao fechar a prévia', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const form = document.getElementById('filtros') as HTMLFormElement;
    const input = document.getElementById('q') as HTMLInputElement;
    input.value = 'carteles politicos';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    form.requestSubmit();
    document.querySelector<HTMLAnchorElement>('a[data-open="diseno-nacional"]')!.click();
  });
  await expect(page.locator('#painel-titulo')).toBeVisible();
  await expect(page).toHaveURL(/\/acervos\/diseno-nacional\/$/);
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/\?q=carteles\+politicos$/);
});
