// Mbrojtja e /admin: vetëm kërkesa me token të vlefshëm të Cloudflare Access kalojnë.
// - Prodhim: verifikim i plotë i JWT-së (nënshkrim, lëshues, audiencë, skadim, email opsional).
// - Konfigurim që mungon: refuzim (503). Kurrë "hapur si parazgjedhje".
// - Zhvillim lokal (`astro dev`, vetëm localhost): kalim i qartë, i padukshëm në build-in e prodhimit.
import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { verifikoJwt } from './lib/access';

const KOKAT = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'",
} as const;

const refuzo = (status: number, tekst: string) =>
  new Response(tekst, { status, headers: { ...KOKAT, 'Content-Type': 'text/plain; charset=utf-8' } });

const DOMENI_KRYESOR = 'www.ermirhaxhia.com';
const DOMENI_PA_WWW = 'ermirhaxhia.com';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, hostname } = context.url;

  // ermirhaxhia.com -> www.ermirhaxhia.com (një adresë kanonike).
  if (hostname === DOMENI_PA_WWW) {
    const gjendja = context.request.method === 'GET' || context.request.method === 'HEAD' ? 301 : 308;
    return Response.redirect(`https://${DOMENI_KRYESOR}${pathname}${context.url.search}`, gjendja);
  }

  if (pathname !== '/admin' && !pathname.startsWith('/admin/')) {
    // Faqet publike: koka bazë sigurie (nuk mbishkruhen ato që vendos vetë faqja).
    const pergjigje = await next();
    const kokat = new Headers(pergjigje.headers);
    if (!kokat.has('X-Content-Type-Options')) kokat.set('X-Content-Type-Options', 'nosniff');
    if (!kokat.has('Referrer-Policy')) kokat.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (!kokat.has('X-Frame-Options')) kokat.set('X-Frame-Options', 'SAMEORIGIN');
    return new Response(pergjigje.body, { status: pergjigje.status, statusText: pergjigje.statusText, headers: kokat });
  }

  let email: string;
  const lokal = import.meta.env.DEV && (hostname === 'localhost' || hostname === '127.0.0.1');
  if (lokal) {
    email = 'zhvillim@localhost';
  } else {
    const r = await verifikoJwt(context.request.headers.get('cf-access-jwt-assertion'), {
      teamDomain: env.ACCESS_TEAM_DOMAIN ?? '',
      aud: env.ACCESS_AUD ?? '',
      email: env.ADMIN_EMAIL || undefined,
    });
    if (!r.ok) {
      console.warn(`[admin] refuzuar: ${r.arsyeja}`);
      return r.arsyeja === 'konfigurim-i-pa-plotë'
        ? refuzo(503, 'Paneli nuk është aktivizuar ende (Cloudflare Access nuk është konfiguruar).')
        : refuzo(403, 'Nuk ke qasje.');
    }
    email = r.email;
  }

  // Mbrojtje nga CSRF: çdo kërkesë që ndryshon diçka duhet të vijë nga i njëjti origjinë.
  const metoda = context.request.method;
  if (metoda !== 'GET' && metoda !== 'HEAD') {
    if (context.request.headers.get('origin') !== context.url.origin) return refuzo(403, 'Origjinë e palejuar.');
  }

  context.locals.admin = { email };
  const pergjigja = await next();
  const kokat = new Headers(pergjigja.headers);
  for (const [k, v] of Object.entries(KOKAT)) kokat.set(k, v);
  return new Response(pergjigja.body, { status: pergjigja.status, statusText: pergjigja.statusText, headers: kokat });
});
