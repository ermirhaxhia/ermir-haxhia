// Leximi i përmbajtjes nga D1 (lidhja `DB` te wrangler.jsonc). Faqet publike e thërrasin
// këtë në çdo kërkesë. Rreshtat verifikohen me skemat te schemas.ts.
import { env } from 'cloudflare:workers';
import {
  rrethSkema,
  kontaktSkema,
  projekteSkema,
  lendetSkema,
  projektShkolleSkema,
  dosjaSkema,
  libraSkema,
  faqeFshehurSkema,
} from './schemas';

type Rresht = Record<string, string | number | null>;

async function rreshta(sql: string, ...vlera: (string | number)[]): Promise<Rresht[]> {
  const { results } = await env.DB.prepare(sql).bind(...vlera).all<Rresht>();
  return results;
}

export async function getRrethMeje() {
  const [kryesori, fakte] = await Promise.all([
    rreshta('SELECT teksti FROM rreth WHERE id = 1'),
    rreshta('SELECT etiketa, vlera FROM rreth_fakte ORDER BY renditja'),
  ]);
  return rrethSkema.parse({ teksti: kryesori[0]?.teksti ?? '', fakte });
}

export async function getKontaktet() {
  return kontaktSkema.parse(await rreshta('SELECT etiketa, vlera, url FROM kontakt ORDER BY renditja'));
}

export async function getProjektet() {
  return projekteSkema.parse(
    await rreshta('SELECT data, titulli, pershkrimi, statusi, url FROM projekte ORDER BY renditja'),
  );
}

export async function getLendet() {
  const [lendet, punet] = await Promise.all([
    rreshta('SELECT id, lenda FROM lendet ORDER BY renditja'),
    rreshta(
      'SELECT lenda_id, slug, data, titulli, pershkrimi, statusi, ka_faqe FROM punet_shkolle ORDER BY lenda_id, renditja',
    ),
  ]);
  return lendetSkema.parse(
    lendet.map((l) => ({
      lenda: l.lenda,
      punet: punet
        .filter((p) => p.lenda_id === l.id)
        .map(({ lenda_id: _, ka_faqe, ...p }) => ({ ...p, ka_faqe: ka_faqe === 1 })),
    })),
  );
}

export async function getProjektShkolle(slug: string) {
  const [rr] = await rreshta(
    'SELECT titulli, kategoria, afati, pershkrimi, shiny_url, raporti_pdf_url, linku_per_ndarje FROM projekte_shkolle WHERE slug = ?',
    slug,
  );
  return rr ? projektShkolleSkema.parse(rr) : null;
}

export async function getDosja() {
  const [seksionet, punet] = await Promise.all([
    rreshta('SELECT id, titulli, mjeti FROM dosja_seksione ORDER BY renditja'),
    rreshta('SELECT seksion_id, pamje, data, titulli, pershkrimi, url FROM dosja_punet ORDER BY seksion_id, renditja'),
  ]);
  return dosjaSkema.parse({
    seksionet: seksionet.map((s) => ({
      ...s,
      punet: punet.filter((p) => p.seksion_id === s.id).map(({ seksion_id: _, ...p }) => p),
    })),
  });
}

export async function getLibrat() {
  const [rafte, libra, kurse, etiketat] = await Promise.all([
    rreshta('SELECT id, titulli, ngjyra FROM libra_rafte ORDER BY renditja'),
    rreshta('SELECT raft_id, titulli, autori, statusi, formati, skedari, licenca FROM libra ORDER BY raft_id, renditja'),
    rreshta('SELECT titulli, pershkrimi, url FROM kurse WHERE id = 1'),
    rreshta('SELECT etiketa FROM kurse_etiketat ORDER BY renditja'),
  ]);
  return libraSkema.parse({
    rafte: rafte.map((r) => ({
      titulli: r.titulli,
      ngjyra: r.ngjyra,
      libra: libra.filter((l) => l.raft_id === r.id).map(({ raft_id: _, ...l }) => l),
    })),
    kurse: { ...kurse[0], etiketat: etiketat.map((e) => e.etiketa) },
  });
}

/** Faqe e fshehur sipas kodit; null nëse nuk ekziston (ose kodi ka formë të pavlefshme). */
export async function getFaqeFshehur(kodi: string) {
  if (!/^[a-z0-9]{12,}$/.test(kodi)) return null;
  const [rr] = await rreshta(
    'SELECT kodi, titulli, pershkrimi, shiny_url, raporti_pdf_url FROM faqe_fshehura WHERE kodi = ?',
    kodi,
  );
  return rr ? faqeFshehurSkema.parse(rr) : null;
}
