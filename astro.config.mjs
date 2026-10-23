import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.capridmc.com',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      lastmod: new Date(),
      serialize(item) {
        if (item.url.includes('404') || item.url.includes('thank-you') || item.url.endsWith('.md')) {
          return undefined;
        }
        return item;
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  }
});
