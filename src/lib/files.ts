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
