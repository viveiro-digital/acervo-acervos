/** Configuração editorial do site. Edite aqui, não nos componentes. */
export const siteConfig = {
  name: 'Acervo Acervos',
  subtitle: 'Explore o que iniciativas e arquivos compartilham online.',
  description:
    'Curadoria em construção de iniciativas e arquivos do Brasil e da América Latina que compartilham conteúdo digital consultável, com evidência, condições de acesso e lacunas de cada registro.',
  locale: 'pt-BR',
  /**
   * Canal público para sugestões, correções e pedidos de remoção.
   * Deixe null enquanto não houver canal publicado: o site então diz
   * isso explicitamente, em vez de apontar para um endereço inexistente.
   * Ex.: 'https://github.com/<org>/acervo-acervos/issues/new/choose'
   */
  contactUrl: null as string | null,
  /** Repositório público do código e dos dados (opcional). */
  repoUrl: null as string | null,
};

const deployEnv = import.meta.env.DEPLOY_ENV ?? process.env.DEPLOY_ENV;
const siteUrl = import.meta.env.SITE_URL ?? process.env.SITE_URL;

/** Só indexa quando há URL pública definida E o ambiente é produção. */
export const isIndexable = deployEnv === 'production' && Boolean(siteUrl);
