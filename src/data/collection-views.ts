type CollectionLink = [label: string, href: string];

export const collectionViews: Partial<Record<string, CollectionLink[]>> = {
  'museu-maguta': [
    ['Fotografias', 'https://museumaguta.com.br/formato_obra/fotografia/'],
  ],
  'museu-da-mare': [
    ['Acervo iconográfico', 'https://arquivomuseudamare.org/acervo-iconografico/'],
  ],
  'nova-cartografia-social': [
    ['Comunidades tradicionais quilombolas', 'https://novacartografiasocial.com.br/fasciculos/comunidades-tradicionais-quilombolas/'],
  ],
  zumvi: [
    ['Catálogo virtual', 'https://zumvi.org.br/portfolio_page/catalogo-virtual/'],
    ['Memórias de Resistências Negras', 'https://zumvi.org.br/portfolio_page/exposicao-memorias-resistencias-negras/'],
  ],
  'potencia-tortillera': [
    ['Arquivo de agosto de 1996', 'https://potenciatortillera.blogspot.com/1996/08/'],
  ],
  'acervo-bajuba': [
    ['Poéticas de vida: escritas de si(da)', 'https://acervobajuba.com.br/poeticas-de-vida-escritas-de-sida/'],
  ],
  casca: [
    ['Cordel', 'https://casca-archive.org/items/browse?collection=32'],
    ['Capas de livros', 'https://casca-archive.org/items/browse?collection=33'],
    ['Cartazes', 'https://casca-archive.org/items/browse?collection=39'],
  ],
  'biblioteca-de-zines': [
    ['Visagens no meio do mundo', 'https://www.biblioteca-de-zines.com.br/zines/coletivo-ventos-do-norte-visagens-no-meio-do-mundo'],
    ['Qualquer coincidência, é mera semelhança', 'https://www.biblioteca-de-zines.com.br/zines/robin-m-f-qualquer-coincidencia-e-mera-semelhanca'],
    ['Eu sou um museu de tudo que eu já amei', 'https://www.biblioteca-de-zines.com.br/zines/lana-aura-eu-sou-um-museu-de-tudo-que-eu-ja-amei'],
  ],
  'diseno-nacional': [
    ['Cartazes políticos', 'https://www.disenonacional.cl/carteles/carteles-politicos/'],
    ['Cartazes culturais', 'https://www.disenonacional.cl/carteles/carteles-culturales/'],
    ['Design da informação', 'https://www.disenonacional.cl/editorial/diseno-de-informacion/'],
  ],
  irohin: [
    ['Acervo gráfico', 'https://irohin.org.br/acervo/acervo-grafico/'],
    ['Acervo textual', 'https://irohin.org.br/acervo/acervo-textual/'],
    ['Fotografias de Carlos Moura', 'https://irohin.org.br/acervo/acervo-carlos-moura/'],
  ],
  'cartel-mexico': [
    ['Portfólios de designers', 'https://cartelmexico.org/disenadores/'],
    ['Coleções de cartazes', 'https://cartelmexico.org/colecciones-de-cartel/'],
    ['Cronologia do cartaz', 'https://cartelmexico.org/cronologia/'],
  ],
  'archivo-memoria-trans': [
    ['Fundos e séries', 'https://atom.archivotrans.ar/index.php/informationobject/browse'],
    ['Objetos digitais', 'https://atom.archivotrans.ar/index.php/informationobject/browse?onlyMedia=1&topLod=0&view=card'],
  ],
  'museu-kuahi': [
    ['Acervo etnográfico', 'https://museukuahi.com.br/acervo-etnografico/'],
    ['Acervo arqueológico', 'https://museukuahi.com.br/acervoarqueologico/'],
  ],
};

export const collectionSubtitles: Partial<Record<string, string>> = {
  'acervo-bajuba': 'Exposições e publicações de memória LGBT+.',
  'museu-maguta': 'Fotografias, músicas e publicações do museu Ticuna.',
  'museu-da-mare': 'Fotografias, mapas e documentos das comunidades da Maré.',
  'nova-cartografia-social': 'Mapas e relatos produzidos com comunidades.',
  zumvi: 'Fotografia e memória negra na Bahia.',
  'potencia-tortillera': 'Registros do ativismo lésbico na Argentina.',
  lesvoz: 'Revistas lésbicas feministas mexicanas para ler online.',
  'acervo-da-laje': 'Arte do Subúrbio Ferroviário de Salvador.',
  'archivo-memoria-trans': 'Fotografias, cartas e recortes sobre a memória trans.',
  'biblioteca-de-zines': 'Zines independentes para ler online.',
  'cartel-mexico': 'Cartazes mexicanos em portfólios e coleções.',
  casca: 'Cordéis, capas e cartazes do Nordeste brasileiro.',
  'diseno-nacional': 'Cartazes, publicidade e design editorial, 1840–2000.',
  'grafica-latina': 'Exposições online de design gráfico latino-americano.',
  irohin: 'Jornais, cartazes e fotografias do movimento negro.',
  'mexico-disena': 'Revistas, livros e as pessoas que os fizeram.',
  'museu-kuahi': 'Objetos, fotografias e vídeos das coleções do museu.',
  'tipomap-latam': 'Fontes, designers e fundidoras por país.',
  'xingu-entangled': 'Um mapa interativo da cultura material Kuikuro.',
};
