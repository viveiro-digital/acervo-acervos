type CollectionLink = [label: string, href: string];

export const collectionViews: Partial<Record<string, CollectionLink[]>> = {
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
