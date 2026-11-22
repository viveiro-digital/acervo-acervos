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
    ['Clube de Zines', 'https://www.biblioteca-de-zines.com.br/zines-club'],
    ['Enviar um zine', 'https://www.biblioteca-de-zines.com.br/zines/apply'],
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
  'acervo-bajuba': 'Um memorial da epidemia de aids e publicações de memória LGBT+ brasileira.',
  'museu-maguta': 'Fotografias, cantos e publicações reunidos pelo museu Ticuna.',
  'museu-da-mare': 'Fotografias, mapas e documentos da Maré, no Arquivo Dona Orosina Vieira.',
  'nova-cartografia-social': 'Mapas e relatos produzidos com comunidades.',
  zumvi: 'Festas, manifestações e cotidiano da Bahia pelas lentes de fotógrafos negros.',
  'potencia-tortillera': 'Panfletos, fotos e recortes reunidos por ativistas lésbicas argentinas.',
  lesvoz: 'Revistas lésbicas feministas mexicanas para ler online.',
  'acervo-da-laje': 'Obras de artistas do Subúrbio Ferroviário de Salvador, nas duas casas do acervo.',
  'archivo-memoria-trans': 'Álbuns de família, cartas e recortes preservados pela comunidade trans argentina.',
  'biblioteca-de-zines': 'Fanzines enviados por quem os faz, com leitura gratuita e um clube de criação.',
  'cartel-mexico': 'Cartazes do México, organizados por designer e época.',
  casca: 'Cordéis, capas e cartazes do Nordeste brasileiro.',
  'diseno-nacional': 'Cartazes, anúncios e impressos que contam a história do design chileno, de 1840 a 2000.',
  'grafica-latina': 'Cartazes latino-americanos de cinema, solidariedade e lutas anticoloniais.',
  irohin: 'Edições do jornal Ìrohìn, impressos do movimento negro e fotos da Marcha Zumbi.',
  'mexico-disena': 'Revistas e livros mexicanos ligados a seus designers e editoras.',
  'museu-kuahi': 'Cestaria, cerâmica e registros audiovisuais de povos indígenas do Oiapoque.',
  'tipomap-latam': 'Fontes tipográficas, designers e fundidoras da América Latina, por país.',
  'xingu-entangled': 'Um mapa interativo de objetos e práticas Kuikuro, da pesca à tecelagem de esteiras.',
};
