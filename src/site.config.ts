/** Configuração editorial do site. Edite aqui, não nos componentes. */
export const siteConfig = {
  name: 'Coleção de Acervos Digitais',
  subtitle: 'Acervos do Brasil e da América Latina, com foco na memória comunitária.',
  description:
    'Um catálogo de acervos digitais do Brasil e da América Latina, de arquivos comunitários a coleções de pesquisa.',
  shareTitle: 'Acervos digitais',
  shareDescription: 'Encontre coleções do Brasil e da América Latina e consulte o material na fonte.',
  locale: 'pt-BR',
  contactUrl: 'https://github.com/viveiro-digital/colecao-de-acervos-digitais/issues' as string | null,
  repoUrl: 'https://github.com/viveiro-digital/colecao-de-acervos-digitais' as string | null,
  /**
   * Viveiro Digital. Não há site público verificado; o prompt pede o
   * repositório de documentação como referência provisória. Troque aqui
   * quando houver endereço institucional confirmado.
   */
  viveiro: {
    name: 'Viveiro Digital',
    url: 'https://github.com/viveiro-digital/docs',
    provisional: true,
  },
};

const deployEnv = import.meta.env.DEPLOY_ENV ?? process.env.DEPLOY_ENV;
const siteUrl = import.meta.env.SITE_URL ?? process.env.SITE_URL;

/** Só indexa quando há URL pública definida E o ambiente é produção. */
export const isIndexable = deployEnv === 'production' && Boolean(siteUrl);
