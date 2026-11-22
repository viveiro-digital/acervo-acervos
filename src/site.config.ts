/** Configuração editorial do site. Edite aqui, não nos componentes. */
export const siteConfig = {
  name: 'Acervo Acervos',
  subtitle: 'Explore o que iniciativas e arquivos compartilham online.',
  description:
    'Explore coleções digitais do Brasil e da América Latina, de zines e cartazes a fotografias e documentos.',
  locale: 'pt-BR',
  /**
   * Canal público para sugestões, correções e pedidos de remoção.
   * Decidido em 21/11/2026: issues do repositório no GitHub do Viveiro
   * Digital. O endereço passa a funcionar quando o repositório for publicado
   * em github.com/viveiro-digital/acervo-acervos (ver PENDENTES.md).
   */
  contactUrl: 'https://github.com/viveiro-digital/acervo-acervos/issues' as string | null,
  /** Código-fonte e dados (mesma ressalva acima). */
  repoUrl: 'https://github.com/viveiro-digital/acervo-acervos' as string | null,
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
