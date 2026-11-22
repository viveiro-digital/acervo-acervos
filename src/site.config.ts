/** Configuração editorial do site. Edite aqui, não nos componentes. */
export const siteConfig = {
  name: 'Coleção de Acervos Digitais',
  subtitle: 'Explore acervos digitais e arquivos comunitários do Brasil e da América Latina.',
  description:
    'Um catálogo de acervos digitais do Brasil e da América Latina, de arquivos comunitários a coleções de pesquisa.',
  shareTitle: 'Acervos digitais',
  shareDescription: 'Coleções digitais do Brasil e da América Latina com material disponível para consulta online.',
  locale: 'pt-BR',
  analytics: {
    id: 'G-ZWH8XGYVVG',
    site: 'https://viveiro-digital.github.io/acervos-digitais-colecao/',
  },
  contactUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScd36uSvVGrMqDMPIS7kQ7NP8kD6Y-TvEVmO4k2Hz90jSF8bQ/viewform',
  contactEmail: 'bibliotecadezines@gmail.com',
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
