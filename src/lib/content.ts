// Skemat e përmbajtjes. Çdo skedar te content/ verifikohet në ndërtim:
// një fushë e gabuar ndalon `npm run build` me mesazh të qartë.
// `null` do të thotë "ende pa vlerë" dhe shfaqet në faqe si [ ... ].
import { z } from 'astro/zod';

import rrethRaw from '../../content/rreth.json';
import kontaktRaw from '../../content/kontakt.json';
import projekteRaw from '../../content/projekte.json';
import shkolleRaw from '../../content/shkolle.json';
import dosjaRaw from '../../content/dosja.json';
import libraRaw from '../../content/libra.json';
import fsheharRaw from '../../content/faqe-te-fshehura.json';

const tekst = z.string().nullable();

const rreth = z.object({
  teksti: z.string(),
  fakte: z.array(z.object({ etiketa: z.string(), vlera: tekst })),
});

const kontakt = z.array(z.object({ etiketa: z.string(), vlera: tekst, url: tekst }));

const projekte = z.array(
  z.object({ data: tekst, titulli: tekst, pershkrimi: tekst, statusi: tekst, url: tekst }),
);

const shkolle = z.array(
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

const projektShkolle = z.object({
  titulli: z.string(),
  kategoria: z.string(),
  afati: z.string(),
  pershkrimi: tekst,
  shiny_url: tekst,
  raporti_pdf_url: tekst,
  linku_per_ndarje: tekst,
});

const dosja = z.object({
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

const libra = z.object({
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

const faqeTeFshehur = z.array(
  z.object({
    kodi: z.string().min(12, 'Kodi duhet të ketë të paktën 12 shenja'),
    titulli: z.string(),
    pershkrimi: tekst,
    shiny_url: tekst,
    raporti_pdf_url: tekst,
  }),
);

export const rrethMeje = rreth.parse(rrethRaw);
export const kontaktet = kontakt.parse(kontaktRaw);
export const projektet = projekte.parse(projekteRaw);
export const lendet = shkolle.parse(shkolleRaw);
export const dosjaPunet = dosja.parse(dosjaRaw);
export const librat = libra.parse(libraRaw);
export const faqetFshehura = faqeTeFshehur.parse(fsheharRaw);

// content/shkolle/<slug>.json
const detajeRaw = import.meta.glob('../../content/shkolle/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

export const projekteShkolle = Object.fromEntries(
  Object.entries(detajeRaw).map(([path, data]) => {
    const slug = path.split('/').pop()!.replace(/\.json$/, '');
    return [slug, projektShkolle.parse(data)];
  }),
);

// Çdo punë me `ka_faqe` duhet të ketë skedarin e vet te content/shkolle/.
for (const lenda of lendet) {
  for (const pune of lenda.punet) {
    if (pune.ka_faqe && (!pune.slug || !projekteShkolle[pune.slug])) {
      throw new Error(`content/shkolle.json: "${pune.slug}" ka ka_faqe=true por mungon content/shkolle/${pune.slug}.json`);
    }
  }
}
