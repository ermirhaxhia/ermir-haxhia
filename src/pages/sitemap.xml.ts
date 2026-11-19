// Sitemap: faqet publike dhe faqet e projekteve nga D1. Faqet e fshehura (/p/*) dhe /admin nuk futen kurrë.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { SITE } from '../lib/site';

const STATIKE = ['/', '/fletorja', '/fletorja/projekte', '/fletorja/shkolle', '/fletorja/kontakt', '/dosja', '/libraria'];
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const { results } = await env.DB.prepare('SELECT slug FROM projekte_shkolle ORDER BY slug').all<{ slug: string }>();
  const adresat = [...STATIKE, ...results.map((r) => `/fletorja/shkolle/${r.slug}`)];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    adresat.map((a) => `  <url><loc>${esc(SITE + a)}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
