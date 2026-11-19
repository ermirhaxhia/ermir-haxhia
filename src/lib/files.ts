// Rregullat për skedarët në R2 (lidhja `FILES`). Vetëm çelësat me prefiksin "public/" shërbehen publikisht.
// PDF me të drejta autori NUK duhet të ngarkohen këtu (shih docs/arkitektura.md, seksioni 5).

export const PREFIKSI_PUBLIK = 'public/';

/** Llojet që shfaqen brenda faqes (foto dhe PDF). Çdo lloj tjetër shkarkohet, nuk hapet në shfletues. */
const LLOJET_INLINE: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  pdf: 'application/pdf',
};

/** Çelësi duhet të jetë i formës public/<shteg>, pa "..", pa "//", me shenja të thjeshta. */
export function celesiValid(celesi: string): boolean {
  return (
    /^public\/[A-Za-z0-9][A-Za-z0-9._\-/]{0,200}$/.test(celesi) &&
    !celesi.includes('..') &&
    !celesi.includes('//') &&
    !celesi.endsWith('/')
  );
}

export function llojiInline(celesi: string): string | null {
  const ext = celesi.split('.').pop()?.toLowerCase() ?? '';
  return LLOJET_INLINE[ext] ?? null;
}

/** Adresa publike e një skedari në R2. */
export function urlSkedari(celesi: string): string {
  return `/f/${celesi}`;
}

/** Kokat Content-Range për një përgjigje 206. */
export function contentRange(madhesia: number, r: R2Range | undefined): string | null {
  if (!r) return null;
  let fillimi: number;
  let fundi: number;
  if ('suffix' in r && r.suffix !== undefined) {
    fillimi = Math.max(0, madhesia - r.suffix);
    fundi = madhesia - 1;
  } else {
    fillimi = ('offset' in r && r.offset) || 0;
    fundi = 'length' in r && r.length !== undefined ? Math.min(fillimi + r.length, madhesia) - 1 : madhesia - 1;
  }
  return `bytes ${fillimi}-${fundi}/${madhesia}`;
}

// ---- Ngarkimi nga paneli ----

export const MAKS_NGARKIM = 30 * 1024 * 1024; // 30 MB

const hex = (b: Uint8Array, nga: number, tek: number) => Array.from(b.slice(nga, tek), (x) => x.toString(16).padStart(2, '0')).join('');
const tekstBajte = (b: Uint8Array, nga: number, tek: number) => String.fromCharCode(...b.slice(nga, tek));

/** Shtesa e lejuar e një emri skedari, ose null. */
export function shtesaELejuar(emri: string): string | null {
  const ext = emri.split('.').pop()?.toLowerCase() ?? '';
  return ext in LLOJET_INLINE ? ext : null;
}

/** Kontrollon që bajtet e para të përputhen me shtesën (një .exe i riemërtuar .pdf refuzohet). */
export function bajtetPerputhen(ext: string, b: Uint8Array): boolean {
  switch (ext) {
    case 'png': return hex(b, 0, 8) === '89504e470d0a1a0a';
    case 'jpg':
    case 'jpeg': return hex(b, 0, 3) === 'ffd8ff';
    case 'gif': return tekstBajte(b, 0, 4) === 'GIF8';
    case 'webp': return tekstBajte(b, 0, 4) === 'RIFF' && tekstBajte(b, 8, 12) === 'WEBP';
    case 'avif': return tekstBajte(b, 4, 8) === 'ftyp' && ['avif', 'avis'].includes(tekstBajte(b, 8, 12));
    case 'pdf': return tekstBajte(b, 0, 5) === '%PDF-';
    default: return false;
  }
}

/** Emër i sigurt dhe i lexueshëm për çelësin: a-z, 0-9 dhe viza. */
export function emriISigurt(emri: string): string {
  const baza = emri.replace(/\.[^.]*$/, '');
  const pastruar = baza
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return pastruar || 'skedar';
}
