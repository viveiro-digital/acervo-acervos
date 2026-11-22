/**
 * Vocabulários controlados da Coleção de Acervos Digitais.
 *
 * São uma camada de DESCOBERTA, não uma classificação verdadeira das
 * iniciativas. Cada registro também guarda os termos originais usados
 * pela própria fonte (`themes_original`, `collection_types_original`).
 * Para adicionar um termo: inclua a chave aqui (minúsculas, sem acento,
 * hífen como separador) e o rótulo exibido. Ver docs/CATALOGACAO.md.
 */

export const initiativeTypes = {
  arquivo: 'Arquivo',
  acervo: 'Acervo',
  biblioteca: 'Biblioteca',
  museu: 'Museu',
  colecao: 'Coleção',
  'projeto-de-pesquisa': 'Projeto de pesquisa',
  plataforma: 'Plataforma agregadora',
  diretorio: 'Diretório / base de dados',
  'centro-de-documentacao': 'Centro de documentação',
} as const;

export const stewardshipTypes = {
  independente: 'Independente',
  coletivo: 'Coletivo',
  comunitario: 'Comunitário',
  universidade: 'Universidade',
  governo: 'Governo',
  museu: 'Museu',
  ong: 'Associação / ONG',
  'arquivo-pessoal': 'Arquivo pessoal',
  parceria: 'Parceria',
  desconhecido: 'Não identificado',
} as const;

/** Como a relação com comunidades está (ou não) documentada. */
export const communityEvidenceKinds = {
  'iniciativa-comunitaria': 'Iniciativa comunitária documentada',
  participacao: 'Participação comunitária documentada',
  'conteudo-sobre-comunidade': 'Conteúdo sobre comunidade (governança não documentada)',
  'governanca-comunitaria': 'Governança / controle comunitário documentado',
  desconhecida: 'Evidência desconhecida',
} as const;

export const geographicScopes = {
  local: 'Local',
  regional: 'Regional',
  nacional: 'Nacional',
  transnacional: 'Transnacional',
  diaspora: 'Diáspora',
} as const;

/** ISO 3166-1 alfa-2. Rótulos em português. */
export const countries = {
  BR: 'Brasil',
  AR: 'Argentina',
  CL: 'Chile',
  MX: 'México',
  PR: 'Porto Rico',
  CO: 'Colômbia',
  PE: 'Peru',
  UY: 'Uruguai',
  CU: 'Cuba',
  LATAM: 'América Latina (vários países)',
} as const;

/** ISO 639-1 (ou 639-3 quando não houver 639-1). */
export const languages = {
  pt: 'Português',
  es: 'Espanhol',
  en: 'Inglês',
  fr: 'Francês',
  de: 'Alemão',
  // Línguas indígenas: usar ISO 639-3 verificado na fonte antes de incluir.
} as const;

export const collectionTypes = {
  zines: 'Zines',
  publicacoes: 'Publicações',
  revistas: 'Revistas',
  jornais: 'Jornais',
  cartazes: 'Cartazes',
  cordel: 'Cordel',
  xilogravura: 'Xilogravura',
  tipografia: 'Tipografia',
  'design-editorial': 'Design editorial',
  'marcas-e-embalagens': 'Marcas e embalagens',
  fotografia: 'Fotografia',
  audiovisual: 'Audiovisual',
  som: 'Som',
  'historia-oral': 'História oral',
  'arte-digital': 'Arte digital',
  'obras-de-arte': 'Obras de arte',
  'cultura-material': 'Cultura material',
  'objetos-etnograficos': 'Objetos etnográficos',
  'documentos-textuais': 'Documentos textuais',
  'documentos-pessoais': 'Documentos pessoais',
  'material-grafico-de-movimentos': 'Material gráfico de movimentos',
  dicionarios: 'Dicionários / vocabulários',
} as const;

export const themes = {
  'design-grafico': 'Design gráfico',
  'cultura-visual': 'Cultura visual',
  'memoria-lgbt': 'Memória LGBT+',
  'memoria-trans': 'Memória trans',
  'memoria-lesbica': 'Memória lésbica',
  feminismos: 'Feminismos',
  'movimento-negro': 'Movimento negro',
  'afro-diasporico': 'Afro-brasileiro / afro-diaspórico',
  indigena: 'Povos indígenas',
  periferias: 'Periferias urbanas',
  'cultura-popular': 'Cultura popular',
  'publicacao-independente': 'Publicação independente',
  'cartaz-politico': 'Cartaz político e social',
  ditadura: 'Ditaduras e direitos humanos',
  'direitos-humanos': 'Direitos humanos',
  linguas: 'Línguas',
  territorio: 'Território',
  'arte-contemporanea': 'Arte contemporânea',
  'historia-do-design': 'História do design',
} as const;

export const formats = {
  imagem: 'Imagem',
  texto: 'Texto',
  pdf: 'PDF',
  audio: 'Áudio',
  video: 'Vídeo',
  '3d': '3D',
  'website-emulado': 'Website emulado',
  'objeto-fisico-documentado': 'Objeto físico documentado',
  metadados: 'Somente metadados',
  'post-de-rede-social': 'Post em rede social',
  visualizacao: 'Visualização / diagrama interativo',
} as const;

export const designDimensions = {
  editorial: 'Editorial',
  tipografia: 'Tipografia',
  cartaz: 'Cartaz',
  ilustracao: 'Ilustração',
  identidade: 'Identidade visual',
  processo: 'Processo',
  'materialidade-impressao': 'Materialidade / impressão',
  interface: 'Interface',
} as const;

/** Regime de acesso observado na amostra — ver METODOLOGIA. */
export const accessLevels = {
  'abre-direto': 'Abre direto',
  'exige-cadastro': 'Exige cadastro',
  'acesso-parcial': 'Acesso parcial',
  'so-metadados': 'Só metadados',
  'player-externo': 'Requer player externo',
  restrito: 'Restrito',
  'midia-quebrada': 'Mídia quebrada',
  'nao-validado': 'Ainda não validado',
} as const;

export const linkStatuses = {
  saudavel: 'Link saudável',
  redireciona: 'Redireciona',
  'exige-cadastro': 'Exige cadastro',
  erro: 'Erro',
  'midia-nao-carrega': 'Mídia não carrega',
  'nao-verificado': 'Não verificado',
} as const;

/** Estados de verificação de conteúdo (seção 3 do método). */
export const contentStatuses = {
  conteudo_confirmado: 'Conteúdo confirmado',
  conteudo_parcial: 'Conteúdo parcial',
  catalogo_sem_midia_confirmada: 'Catálogo sem mídia confirmada',
  revisao_pendente: 'Revisão pendente',
  inativo_ou_indisponivel: 'Inativo ou indisponível',
} as const;

export const contentStatusHelp: Record<keyof typeof contentStatuses, string> = {
  conteudo_confirmado:
    'A página individual e o objeto digital foram abertos; o registro diz exatamente o que foi visto.',
  conteudo_parcial:
    'Parte do conteúdo é acessível, mas a coleção, a mídia ou o acesso é incompleto ou condicionado.',
  catalogo_sem_midia_confirmada:
    'Há registros e metadados, mas nenhuma mídia foi vista ou reproduzida.',
  revisao_pendente:
    'Achado promissor que ainda precisa de checagem humana (item, link, autoria, procedência ou acesso).',
  inativo_ou_indisponivel:
    'Indisponível na última verificação. O registro e o histórico são preservados.',
};

export const evidenceKinds = {
  declarado: 'Declarado pela iniciativa',
  observado: 'Observado pela curadoria',
  interpretacao: 'Interpretação editorial',
  terceiros: 'Fonte de terceiros',
} as const;

export const certaintyLevels = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
} as const;

export const recordStatuses = {
  rascunho: 'Rascunho',
  publicado: 'Publicado',
  arquivado: 'Arquivado',
} as const;

export const reviewPriorities = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
} as const;

export const datePrecisions = {
  ano: 'Ano',
  decada: 'Década',
  intervalo: 'Intervalo',
  circa: 'Circa',
  desconhecido: 'Desconhecido',
} as const;

type Keys<T> = [keyof T & string, ...(keyof T & string)[]];
/** Helper: chaves de um vocabulário como tupla para z.enum. */
export const keysOf = <T extends Record<string, string>>(o: T) =>
  Object.keys(o) as Keys<T>;

/** Rótulo para exibição, com fallback para a própria chave. */
export function label(vocab: Record<string, string>, key: string): string {
  return vocab[key] ?? key;
}
