import { defineConfig, sessionDrivers } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Të gjitha faqet lexojnë nga D1 në çdo kërkesë, ndaj output është 'server'.
// Sitemap: do të bëhet në M7 (faqet janë dinamike dhe @astrojs/sitemap nuk i sheh vetë).
export default defineConfig({
  output: 'server',
  // Nuk përdorim sesione Astro (hyrja në /admin bëhet nga Cloudflare Access) dhe as optimizim fotosh
  // me Cloudflare Images. Pa këto dy, adapteri nuk krijon KV dhe Images binding te llogaria.
  session: { driver: sessionDrivers.null() },
  adapter: cloudflare({ imageService: 'passthrough' }),
});
