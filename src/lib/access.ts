// Verifikimi i tokenit të Cloudflare Access (koka Cf-Access-Jwt-Assertion).
// Pa varësi nga Astro ose Workers, vetëm WebCrypto, që të testohet edhe me Node.
// Parimi: "dështo e mbyllur". Çdo gabim, konfigurim që mungon ose token i dyshimtë do të thotë refuzim.

export interface AccessKonfig {
  /** p.sh. "ekipi.cloudflareaccess.com" */
  teamDomain: string;
  /** "Application Audience (AUD) Tag" i aplikacionit te Access */
  aud: string;
  /** Opsionale: nëse vendoset, vetëm ky email pranohet (mbrojtje shtesë mbi politikën e Access) */
  email?: string;
}

export type Jwk = JsonWebKey & { kid?: string };
export type Rezultati = { ok: true; email: string } | { ok: false; arsyeja: string };

const TEAM_RE = /^[a-z0-9][a-z0-9-]*\.cloudflareaccess\.com$/;
const jwksCache = new Map<string, { keys: Jwk[]; skadon: number }>();

export function normalizoTeamDomain(vlera: string | undefined): string | null {
  const v = (vlera ?? '').trim().toLowerCase().replace(/^https:\/\//, '').replace(/\/+$/, '');
  return TEAM_RE.test(v) ? v : null;
}

function b64urlBajte(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const bajte = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) bajte[i] = bin.charCodeAt(i);
  return bajte;
}

function b64urlJson<T>(s: string): T {
  return JSON.parse(new TextDecoder().decode(b64urlBajte(s))) as T;
}

async function merrJwks(teamDomain: string, rifresko: boolean): Promise<Jwk[]> {
  const tani = Date.now();
  const cache = jwksCache.get(teamDomain);
  if (!rifresko && cache && cache.skadon > tani) return cache.keys;
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`JWKS ${res.status}`);
  const { keys } = (await res.json()) as { keys: Jwk[] };
  jwksCache.set(teamDomain, { keys, skadon: tani + 10 * 60 * 1000 });
  return keys;
}

/**
 * Verifikon nënshkrimin RS256, lëshuesin, audiencën, skadimin dhe (opsionalisht) emailin.
 * `jwks` përdoret vetëm në prova; në prodhim merret nga Cloudflare.
 */
export async function verifikoJwt(
  token: string | null | undefined,
  konfig: AccessKonfig,
  opsione: { jwks?: Jwk[]; tani?: number } = {},
): Promise<Rezultati> {
  try {
    const team = normalizoTeamDomain(konfig.teamDomain);
    if (!team || !konfig.aud) return { ok: false, arsyeja: 'konfigurim-i-pa-plotë' };
    if (!token) return { ok: false, arsyeja: 'pa-token' };

    const pjeset = token.split('.');
    if (pjeset.length !== 3) return { ok: false, arsyeja: 'token-i-keq' };
    const [h, p, s] = pjeset;

    const header = b64urlJson<{ alg?: string; kid?: string }>(h);
    if (header.alg !== 'RS256' || !header.kid) return { ok: false, arsyeja: 'alg-ose-kid' };

    const payload = b64urlJson<{ iss?: string; aud?: string | string[]; exp?: number; nbf?: number; email?: string }>(p);
    const koha = Math.floor((opsione.tani ?? Date.now()) / 1000);
    if (payload.iss !== `https://${team}`) return { ok: false, arsyeja: 'lëshues' };
    const audet = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audet.includes(konfig.aud)) return { ok: false, arsyeja: 'audienca' };
    if (typeof payload.exp !== 'number' || payload.exp + 30 < koha) return { ok: false, arsyeja: 'skaduar' };
    if (typeof payload.nbf === 'number' && payload.nbf - 30 > koha) return { ok: false, arsyeja: 'ende-jo-i-vlefshëm' };
    if (!payload.email) return { ok: false, arsyeja: 'pa-email' };

    let celesat = opsione.jwks ?? (await merrJwks(team, false));
    let celesi = celesat.find((k) => k.kid === header.kid);
    if (!celesi && !opsione.jwks) {
      celesat = await merrJwks(team, true); // çelësat mund të jenë rrotulluar
      celesi = celesat.find((k) => k.kid === header.kid);
    }
    if (!celesi) return { ok: false, arsyeja: 'çelës-i-panjohur' };

    const kyc = await crypto.subtle.importKey('jwk', celesi, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const vlefshem = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      kyc,
      b64urlBajte(s),
      new TextEncoder().encode(`${h}.${p}`),
    );
    if (!vlefshem) return { ok: false, arsyeja: 'nënshkrim' };

    if (konfig.email && payload.email.toLowerCase() !== konfig.email.trim().toLowerCase()) {
      return { ok: false, arsyeja: 'email-i-palejuar' };
    }
    return { ok: true, email: payload.email };
  } catch {
    return { ok: false, arsyeja: 'gabim' };
  }
}
