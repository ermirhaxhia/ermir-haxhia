import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Të gjitha faqet lexojnë nga D1 në çdo kërkesë, ndaj output është 'server'.
// Sitemap: do të bëhet në M7 (faqet janë dinamike dhe @astrojs/sitemap nuk i sheh vetë).
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
