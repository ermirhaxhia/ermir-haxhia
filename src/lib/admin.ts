// Veprimet e panelit mbi D1: lexim, shtim, ruajtje, fshirje, ndryshim rendi.
// Tabelat dhe kolonat vijnë vetëm nga admin-config.ts; vlerat shkojnë gjithmonë si parametra (bind).
import { env } from 'cloudflare:workers';
import type { Entitet, Fusha } from './admin-config';

type Vlere = string | number | null;
export type Rresht = Record<string, Vlere>;
export type Perfundim = { ok: true } | { ok: false; gabim: string };

const URL_RE = /^(https?:\/\/[^\s<>"']{1,490}|\/f\/public\/[A-Za-z0-9][A-Za-z0-9._\-/]{0,200})$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const KOD_RE = /^[a-z0-9]{12,}$/;
const ALFABETI_KOD = 'abcdefghijkmnpqrstuvwxyz23456789';

export function gjeneroKod(): string {
  const bajte = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bajte, (b) => ALFABETI_KOD[b % ALFABETI_KOD.length]).join('');
}

/** Lexon rreshtat e një entiteti, në rendin e shfaqjes. */
export async function lexoRreshtat(e: Entitet): Promise<Rresht[]> {
  const rendi = e.renditja
    ? `${e.grupiSipas ? `${e.grupiSipas}, ` : ''}renditja, ${e.celesi}`
    : e.celesi;
  const { results } = await env.DB.prepare(`SELECT * FROM ${e.tabela} ORDER BY ${rendi}`).all<Rresht>();
  return results;
}

/** Opsionet e një fushe "burim" (p.sh. lëndët për punët e shkollës). */
export async function opsioneBurimi(f: Fusha): Promise<{ vlera: string; etiketa: string }[]> {
  if (!f.burimi) return [];
  const { tabela, vlera, etiketa } = f.burimi;
  const { results } = await env.DB.prepare(
    `SELECT ${vlera} AS v, ${etiketa} AS e FROM ${tabela} ORDER BY renditja, ${vlera}`,
  ).all<{ v: string | number; e: string | null }>();
  return results.map((r) => ({ vlera: String(r.v), etiketa: r.e ?? `[pa emër #${r.v}]` }));
}

const pastro = (v: FormDataEntryValue | null): string =>
  typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim() : '';

/** Validon dhe pastron vlerat e formularit sipas fushave. */
export function lexoFushat(
  e: Entitet,
  formular: FormData,
  { shtim }: { shtim: boolean },
): { ok: true; vlerat: Record<string, Vlere> } | { ok: false; gabim: string } {
  const vlerat: Record<string, Vlere> = {};
  for (const f of e.fushat) {
    if (f.vetemShtim && !shtim) continue;

    if (f.lloji === 'poJo') {
      vlerat[f.emri] = formular.has(f.emri) ? 1 : 0;
      continue;
    }
    const tekst = pastro(formular.get(f.emri));
    // Shenja kontrolli (përveç rresht i ri dhe tab) nuk lejohen.
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(tekst)) return { ok: false, gabim: `"${f.etiketa}" ka shenja të palejuara.` };

    if (tekst === '') {
      if (f.kerkohet) return { ok: false, gabim: `"${f.etiketa}" është i detyrueshëm.` };
      vlerat[f.emri] = null;
      continue;
    }
    switch (f.lloji) {
      case 'tekst':
        if (tekst.length > 300) return { ok: false, gabim: `"${f.etiketa}" është shumë i gjatë (maks. 300).` };
        break;
      case 'tekstGjate':
        if (tekst.length > 2000) return { ok: false, gabim: `"${f.etiketa}" është shumë i gjatë (maks. 2000).` };
        break;
      case 'url':
      case 'skedar':
        if (!URL_RE.test(tekst)) return { ok: false, gabim: `"${f.etiketa}" duhet të fillojë me https:// ose http:// (ose të jetë /f/public/… për skedarët e ngarkuar).` };
        break;
      case 'slug':
        if (!SLUG_RE.test(tekst) || tekst.length > 60) return { ok: false, gabim: `"${f.etiketa}" lejon vetëm shkronja të vogla, shifra dhe viza (p.sh. projekt-r-shiny).` };
        break;
      case 'zgjedhje':
        if (!f.opsione?.some((o) => o.vlera === tekst)) return { ok: false, gabim: `"${f.etiketa}" ka vlerë të palejuar.` };
        break;
      case 'burim': {
        // Çelësi i huaj: numër (id), ose slug për seksionet e dosjes.
        const tekstId = f.burimi?.tabela === 'dosja_seksione';
        if (tekstId ? !SLUG_RE.test(tekst) : !/^[0-9]{1,9}$/.test(tekst)) {
          return { ok: false, gabim: `"${f.etiketa}" ka vlerë të palejuar.` };
        }
        vlerat[f.emri] = tekstId ? tekst : Number(tekst);
        continue;
      }
    }
    vlerat[f.emri] = tekst;
  }
  return { ok: true, vlerat };
}

/** Çelësi i rreshtit nga formulari (id numër ose tekst i vlefshëm). */
export function lexoCelesin(e: Entitet, v: FormDataEntryValue | null): Vlere {
  const t = pastro(v);
  if (e.celesiLloji === 'numer') return /^[0-9]{1,9}$/.test(t) ? Number(t) : null;
  if (e.celesi === 'kodi') return KOD_RE.test(t) ? t : null;
  return SLUG_RE.test(t) && t.length <= 60 ? t : null;
}

const GABIM_DB = 'Nuk u ruajt. Kontrollo vlerat (p.sh. slug-u mund të jetë përdorur tashmë).';

export async function shto(e: Entitet, vlerat: Record<string, Vlere>): Promise<Perfundim> {
  try {
    if (e.njeRresht) return { ok: false, gabim: 'Ky seksion ka vetëm një rresht.' };
    const kolonat = Object.keys(vlerat);
    const vlerNeBind: Vlere[] = kolonat.map((k) => vlerat[k]);
    if (e.gjeneroKod) {
      kolonat.push(e.celesi);
      vlerNeBind.push(gjeneroKod());
    }
    if (e.renditja) {
      const grupi = e.grupiSipas ? vlerat[e.grupiSipas] : null;
      const sql = e.grupiSipas
        ? `SELECT COALESCE(MAX(renditja), -1) + 1 AS r FROM ${e.tabela} WHERE ${e.grupiSipas} = ?`
        : `SELECT COALESCE(MAX(renditja), -1) + 1 AS r FROM ${e.tabela}`;
      const stmt = env.DB.prepare(sql);
      const rr = await (e.grupiSipas ? stmt.bind(grupi) : stmt).first<{ r: number }>();
      kolonat.push('renditja');
      vlerNeBind.push(rr?.r ?? 0);
    }
    await env.DB.prepare(
      `INSERT INTO ${e.tabela} (${kolonat.join(', ')}) VALUES (${kolonat.map(() => '?').join(', ')})`,
    )
      .bind(...vlerNeBind)
      .run();
    return { ok: true };
  } catch (err) {
    console.error('[admin] shto', err);
    return { ok: false, gabim: GABIM_DB };
  }
}

export async function ruaj(e: Entitet, celesi: Vlere, vlerat: Record<string, Vlere>): Promise<Perfundim> {
  try {
    const kolonat = Object.keys(vlerat);
    if (kolonat.length === 0) return { ok: true };
    const r = await env.DB.prepare(
      `UPDATE ${e.tabela} SET ${kolonat.map((k) => `${k} = ?`).join(', ')} WHERE ${e.celesi} = ?`,
    )
      .bind(...kolonat.map((k) => vlerat[k]), celesi)
      .run();
    return r.meta.changes > 0 ? { ok: true } : { ok: false, gabim: 'Rreshti nuk u gjet (mund të jetë fshirë).' };
  } catch (err) {
    console.error('[admin] ruaj', err);
    return { ok: false, gabim: GABIM_DB };
  }
}

export async function fshi(e: Entitet, celesi: Vlere): Promise<Perfundim> {
  try {
    if (e.njeRresht) return { ok: false, gabim: 'Ky seksion nuk fshihet.' };
    await env.DB.prepare(`DELETE FROM ${e.tabela} WHERE ${e.celesi} = ?`).bind(celesi).run();
    return { ok: true };
  } catch (err) {
    console.error('[admin] fshi', err);
    return { ok: false, gabim: 'Nuk u fshi.' };
  }
}

/** Zhvendos një rresht lart ose poshtë brenda grupit të vet dhe rinumëron grupin. */
export async function leviz(e: Entitet, celesi: Vlere, drejtimi: 'lart' | 'poshte'): Promise<Perfundim> {
  try {
    if (!e.renditja) return { ok: false, gabim: 'Ky seksion nuk ka renditje.' };
    const g = e.grupiSipas;
    const { results } = await env.DB.prepare(
      `SELECT ${e.celesi} AS k${g ? `, ${g} AS g` : ''} FROM ${e.tabela} ORDER BY ${g ? `${g}, ` : ''}renditja, ${e.celesi}`,
    ).all<{ k: Vlere; g?: Vlere }>();
    const rr = results.find((r) => r.k === celesi);
    if (!rr) return { ok: false, gabim: 'Rreshti nuk u gjet.' };
    const grupi = results.filter((r) => !g || r.g === rr.g);
    const i = grupi.findIndex((r) => r.k === celesi);
    const j = drejtimi === 'lart' ? i - 1 : i + 1;
    if (j < 0 || j >= grupi.length) return { ok: true };
    [grupi[i], grupi[j]] = [grupi[j], grupi[i]];
    await env.DB.batch(
      grupi.map((r, n) => env.DB.prepare(`UPDATE ${e.tabela} SET renditja = ? WHERE ${e.celesi} = ?`).bind(n, r.k)),
    );
    return { ok: true };
  } catch (err) {
    console.error('[admin] leviz', err);
    return { ok: false, gabim: 'Rendi nuk u ndryshua.' };
  }
}

/** Numri i rreshtave për secilin entitet (faqja kryesore e panelit). */
export async function numrat(entitetet: Entitet[]): Promise<Record<string, number>> {
  const rez = await env.DB.batch(entitetet.map((e) => env.DB.prepare(`SELECT count(*) AS c FROM ${e.tabela}`)));
  return Object.fromEntries(entitetet.map((e, i) => [e.id, (rez[i].results[0] as { c: number }).c]));
}

export interface SkedarNeR2 {
  celesi: string;
  madhesia: number;
  ngarkuar: Date;
}

/** Skedarët publikë në R2 (deri në 500), më të rejat së pari. */
export async function listoSkedaret(): Promise<SkedarNeR2[]> {
  const lista = await env.FILES.list({ prefix: 'public/', limit: 500 });
  return lista.objects
    .map((o) => ({ celesi: o.key, madhesia: o.size, ngarkuar: o.uploaded }))
    .sort((a, b) => b.ngarkuar.getTime() - a.ngarkuar.getTime());
}
