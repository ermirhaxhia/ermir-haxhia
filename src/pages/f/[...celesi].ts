// Shërben skedarët publikë nga R2: /f/public/<shteg>. Mbështet ETag dhe Range (PDF të mëdha).
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { celesiValid, llojiInline, contentRange } from '../../lib/files';

export const GET: APIRoute = async ({ params, request }) => {
  const celesi = params.celesi ?? '';
  if (!celesiValid(celesi)) return new Response(null, { status: 404 });

  const objekti = await env.FILES.get(celesi, { range: request.headers, onlyIf: request.headers });
  if (!objekti) return new Response(null, { status: 404 });

  // Lloji vendoset nga shtesa e skedarit (jo nga ai që e ngarkoi), që asgjë të mos hapet si HTML/skript.
  const lloji = llojiInline(celesi);
  const kokat = new Headers({
    'Content-Type': lloji ?? 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=300',
    ETag: objekti.httpEtag,
  });
  if (!lloji) kokat.set('Content-Disposition', 'attachment');

  // Kushti If-None-Match plotësuar: R2 kthen objekt pa trup.
  if (!('body' in objekti)) return new Response(null, { status: 304, headers: kokat });

  // 206 vetëm kur shfletuesi e ka kërkuar vërtet një Range (R2 raporton një range edhe për kërkesa të plota).
  const range = request.headers.has('range') ? contentRange(objekti.size, objekti.range) : null;
  if (range) {
    kokat.set('Content-Range', range);
    return new Response(objekti.body, { status: 206, headers: kokat });
  }
  kokat.set('Content-Length', String(objekti.size));
  return new Response(objekti.body, { status: 200, headers: kokat });
};
