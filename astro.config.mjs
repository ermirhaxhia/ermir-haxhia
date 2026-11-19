import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Faqe statike. Domeni vendoset te M8 përmes variablës SITE_URL (shih .env.example);
// pa të nuk gjenerohet sitemap.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  output: 'static',
  site,
  integrations: site
    ? [
        sitemap({
          // Faqet e fshehura nuk duhet të dalin kurrë në sitemap.
          filter: (page) => !new URL(page).pathname.startsWith('/p/'),
        }),
      ]
    : [],
});
