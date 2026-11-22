/**
 * Schema dos registros de Acervo Acervos (versão 1 do schema).
 *
 * Cada registro é um arquivo YAML em src/content/acervos/<id>.yaml.
 * O build falha com mensagem do Zod indicando arquivo e campo quando
 * algo não segue o schema. Nenhuma URL é acessada durante o build:
 * só a sintaxe é validada.
 *
 * Ao mudar este arquivo, atualize SCHEMA_VERSION e o README.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  accessLevels,
  certaintyLevels,
  collectionTypes,
  communityEvidenceKinds,
  contentStatuses,
  countries,
  datePrecisions,
  designDimensions,
  evidenceKinds,
  formats,
  geographicScopes,
  initiativeTypes,
  keysOf,
  languages,
  linkStatuses,
  recordStatuses,
  reviewPriorities,
  stewardshipTypes,
  themes,
} from './data/vocabulario';

export const SCHEMA_VERSION = 5; // v5: arquivos de obras preservados como caminhos no repositório

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use data ISO no formato AAAA-MM-DD');
const url = z.url({ message: 'URL inválida (inclua https://)' });
const langCode = z.enum(keysOf(languages));

/** Texto editorial da plataforma. `pt` é obrigatório; es/en opcionais. */
const editorialText = z.object({
  pt: z.string().min(1),
  es: z.string().optional(),
  en: z.string().optional(),
});

/** Uma afirmação importante + sua fonte. */
const evidence = z.object({
  claim: z.string().min(1),
  source_url: url,
  accessed_at: isoDate,
  kind: z.enum(keysOf(evidenceKinds)),
  certainty: z.enum(keysOf(certaintyLevels)).default('media'),
  note: z.string().optional(),
});

const changeLogEntry = z.object({
  date: isoDate,
  field: z.string(),
  from: z.string().nullable().optional(),
  to: z.string().nullable().optional(),
  reason: z.string(),
  source: z.string().optional(),
});

/**
 * Evidência de mídia preservada no repositório. O site abre a obra na fonte.
 * A existência e o checksum do arquivo local são validados em check:data.
 */
const mediaItem = z.object({
  local_asset: z.string().min(1),
  /** URL do arquivo de imagem na fonte. */
  source_url: url,
  /** Página do item na fonte (onde a licença está declarada). */
  page_url: url,
  relation: z.enum(['amostra-verificada', 'item-do-acervo']),
  credit: z.string(),
  license_or_permission: z.string(),
  license_url: url.optional(),
  /** Texto alternativo e de onde ele vem. */
  alt: z.string().min(1),
  alt_source: z.enum(['fonte', 'curadoria']),
  caption: z.string().optional(),
  rights_checked_at: isoDate,
  /** Data em que o arquivo foi obtido da fonte. */
  retrieved_at: isoDate,
  /** Checksum publicado pela fonte, se houver (para conferir no recebimento). */
  source_checksum: z.string().optional(),
  order: z.number().int().default(0),
});

const acervos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/acervos' }),
  schema: z
    .object({
      // ── Identidade e contexto ────────────────────────────────
      id: z.string().regex(/^[a-z0-9-]+$/, 'id: minúsculas, números e hífen'),
      name: z.string(),
      preferred_name: z.string().optional(),
      alternative_names: z.array(z.string()).default([]),
      initiative_type: z.enum(keysOf(initiativeTypes)),
      /** Autodescrição, no idioma original, citada da fonte. */
      self_description: z
        .object({
          text: z.string(),
          lang: langCode,
          source_url: url,
        })
        .optional(),
      /** Descrição editorial curta, escrita por Acervo Acervos. */
      description: editorialText,
      initiative_url: url,
      digital_collection_url: url,
      sample_content_url: url,
      /** Canal por onde o conteúdo é acessado quando não é site próprio. */
      access_channel: z
        .object({
          platform: z.string(),
          limitations: z.string(),
        })
        .optional(),
      /**
       * Software ou serviço que publica o acervo (ISDIAH 5.3.8, instrumentos
       * de pesquisa). `evidence` diz como foi identificado.
       */
      platform: z
        .object({
          software: z.string(),
          evidence: z.enum(['meta-generator', 'api-da-plataforma', 'caminhos-de-arquivos', 'canal-declarado']),
          note: z.string().optional(),
          checked_at: isoDate,
        })
        .optional(),
      /** Pontos de acesso por máquina que testamos (OAI-PMH, API, exportações). */
      machine_access: z
        .array(
          z.object({
            kind: z.enum(['oai-pmh', 'api-rest', 'exportacao-dublin-core', 'exportacao-json', 'sitemap']),
            url: url,
            status: z.enum(['testado-com-registros', 'testado-sem-registros', 'oferecido-nao-testado']),
            note: z.string().optional(),
            checked_at: isoDate,
          }),
        )
        .default([]),
      /**
       * Extensão do acervo (ISDIAH 5.3.7, ISAD(G) 3.1.5). Sempre com a base:
       * declarada pela fonte ou contada por nós (via API ou na página).
       */
      holdings_extent: z
        .array(
          z.object({
            statement: z.string(),
            scope: z.string(),
            basis: z.enum(['declarado-pela-fonte', 'contado-via-api', 'contado-na-pagina']),
            source_url: url,
            accessed_at: isoDate,
          }),
        )
        .default([]),
      country: z.array(z.enum(keysOf(countries))).min(1),
      region: z.string().optional(),
      city: z.string().optional(),
      geographic_scope: z.enum(keysOf(geographicScopes)),
      territory_note: z.string().optional(),
      languages: z.array(langCode).min(1),

      // ── Conteúdo, temas e formas ─────────────────────────────
      collection_types: z.array(z.enum(keysOf(collectionTypes))).min(1),
      collection_types_original: z.array(z.string()).default([]),
      themes: z.array(z.enum(keysOf(themes))).default([]),
      themes_original: z.array(z.string()).default([]),
      formats: z.array(z.enum(keysOf(formats))).min(1),
      date_range: z.object({
        start: z.number().int().nullable(),
        end: z.number().int().nullable(),
        precision: z.enum(keysOf(datePrecisions)),
        label: z.string(),
        source_note: z.string().optional(),
      }),
      design_dimensions: z.array(z.enum(keysOf(designDimensions))).default([]),
      /** Referências de imagem preservadas no repositório (pode ficar vazio). */
      media: z.array(mediaItem).default([]),
      /** Por que não há imagem exibida (aparece no fallback tipográfico). */
      media_note: z.string().optional(),

      // ── Amostra ──────────────────────────────────────────────
      sample: z.object({
        title: z.string(),
        /**
         * Nível de descrição da amostra, nos termos da ISAD(G) (fundo, série,
         * dossiê, item), ou `pagina-agregada` quando a amostra é uma página que
         * reúne vários itens sem ficha própria. `declared_by_source` diz se o
         * nível é o declarado pela fonte ou atribuído pela curadoria.
         */
        level_of_description: z.object({
          value: z.enum(['fundo', 'serie', 'dossie', 'item', 'pagina-agregada', 'nao-se-aplica']),
          declared_by_source: z.boolean(),
        }),
        /** Resumo do que foi observado — escrito pela curadoria. */
        observed: z.string(),
        /** O que exatamente foi confirmado (imagem, PDF, player…). */
        confirmed_media: z.array(z.enum(keysOf(formats))).default([]),
        creator: z.string().optional(),
        date: z.string().optional(),
        alt_from_source: z.string().optional(),
        rights_text: z.string().optional(),
      }),

      // ── Governança, evidência e cuidado ──────────────────────
      stewardship_or_host: z.object({
        type: z.enum(keysOf(stewardshipTypes)),
        name: z.string().optional(),
        note: z.string(),
        source_url: url.optional(),
      }),
      community_evidence: z.object({
        kind: z.enum(keysOf(communityEvidenceKinds)),
        note: z.string(),
        source_url: url.optional(),
      }),
      curatorial_reason: editorialText,
      evidence: z.array(evidence).min(1),
      provenance_note: z.string().optional(),
      access_level: z.enum(keysOf(accessLevels)),
      access_requirements: z.string().optional(),
      access_notes: z.string().optional(),
      rights_and_reuse: z.object({
        statement: z.string().default('desconhecido'),
        source_url: url.optional(),
      }),
      sensitive_content_note: z.string().optional(),
      community_protocol: z.string().optional(),
      removal_or_contact_url: z.string().optional(),
      /** Vínculos entre a curadoria e a iniciativa (conflito de interesse). */
      relationship_disclosure: z.string().optional(),
      gaps: z.array(z.string()).default([]),

      // ── Verificação e histórico ──────────────────────────────
      last_verified_at: isoDate,
      verification_method: z.string(),
      link_status: z.enum(keysOf(linkStatuses)),
      content_status: z.enum(keysOf(contentStatuses)),
      review_flag: z.boolean().default(false),
      review_reason: z.string().optional(),
      review_priority: z.enum(keysOf(reviewPriorities)).optional(),
      record_status: z.enum(keysOf(recordStatuses)),
      demo: z.boolean().default(false),
      created_at: isoDate,
      updated_at: isoDate,
      /** Slugs antigos que devem redirecionar para este registro. */
      previous_ids: z.array(z.string()).default([]),
      change_log: z.array(changeLogEntry).min(1),
    })
    .superRefine((r, ctx) => {
      if (r.review_flag && !r.review_reason) {
        ctx.addIssue({
          code: 'custom',
          path: ['review_reason'],
          message: 'review_flag: true exige review_reason',
        });
      }
      if (
        r.content_status === 'conteudo_confirmado' &&
        r.sample.confirmed_media.length === 0
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['sample', 'confirmed_media'],
          message:
            'conteudo_confirmado exige listar o que foi confirmado em sample.confirmed_media',
        });
      }
      if (r.updated_at < r.created_at) {
        ctx.addIssue({
          code: 'custom',
          path: ['updated_at'],
          message: 'updated_at não pode ser anterior a created_at',
        });
      }
    }),
});

/** Iniciativas verificadas e deixadas de fora, com motivo (lacunas). */
const foraDoCatalogo = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/fora-do-catalogo' }),
  schema: z.object({
    name: z.string(),
    url: url,
    checked_at: isoDate,
    reason: z.string(),
    revisit: z.string().optional(),
  }),
});

export const collections = { acervos, foraDoCatalogo };
