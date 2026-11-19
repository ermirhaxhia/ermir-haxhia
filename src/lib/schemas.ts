// Skemat e të dhënave të faqes (zod). Çdo rresht i lexuar nga D1 verifikohet kundrejt tyre.
// `null` do të thotë "ende pa vlerë" dhe shfaqet në faqe si [ ... ].
import { z } from 'astro/zod';

const tekst = z.string().nullable();

export const rrethSkema = z.object({
  teksti: z.string(),
  fakte: z.array(z.object({ etiketa: z.string(), vlera: tekst })),
});

export const kontaktSkema = z.array(z.object({ etiketa: z.string(), vlera: tekst, url: tekst }));

export const projekteSkema = z.array(
  z.object({ data: tekst, titulli: tekst, pershkrimi: tekst, statusi: tekst, url: tekst }),
);

export const lendetSkema = z.array(
  z.object({
    lenda: tekst,
    punet: z.array(
      z.object({
        slug: tekst,
        data: tekst,
        titulli: tekst,
        pershkrimi: tekst,
        statusi: tekst,
        ka_faqe: z.boolean(),
      }),
    ),
  }),
);

export const projektShkolleSkema = z.object({
  titulli: z.string(),
  kategoria: z.string(),
  afati: z.string(),
  pershkrimi: tekst,
  shiny_url: tekst,
  raporti_pdf_url: tekst,
  linku_per_ndarje: tekst,
});

export const dosjaSkema = z.object({
  seksionet: z.array(
    z.object({
      id: z.string(),
      titulli: z.string(),
      mjeti: z.string(),
      punet: z.array(
        z.object({ pamje: tekst, data: tekst, titulli: tekst, pershkrimi: tekst, url: tekst }),
      ),
    }),
  ),
});

export const libraSkema = z.object({
  rafte: z.array(
    z.object({
      titulli: z.string(),
      ngjyra: z.enum(['navy', 'sage', 'kraft']),
      libra: z.array(
        z.object({
          titulli: tekst,
          autori: tekst,
          statusi: z.enum(['lexuar', 'duke lexuar', "për t'u lexuar"]),
          formati: z.enum(['PDF', 'Fizik']),
          skedari: tekst,
          licenca: tekst,
        }),
      ),
    }),
  ),
  kurse: z.object({
    titulli: z.string(),
    pershkrimi: tekst,
    url: tekst,
    etiketat: z.array(z.string()),
  }),
});

export const faqeFshehurSkema = z.object({
  kodi: z
    .string()
    .min(12, 'Kodi duhet të ketë të paktën 12 shenja')
    .regex(/^[a-z0-9]+$/, 'Kodi lejon vetëm shkronja të vogla (a-z) dhe shifra'),
  titulli: z.string(),
  pershkrimi: tekst,
  shiny_url: tekst,
  raporti_pdf_url: tekst,
});

export type ProjektShkolle = z.infer<typeof projektShkolleSkema>;
export type FaqeFshehur = z.infer<typeof faqeFshehurSkema>;
