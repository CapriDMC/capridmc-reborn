import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const legacyRedirects = JSON.parse(
  fs.readFileSync(new URL('./src/data/legacy-redirects.json', import.meta.url), 'utf8')
);
const redirectPaths = new Set(Object.keys(legacyRedirects));

/**
 * Mirrors Astro file-format redirect stubs (`<slug>.html`) into directory indexes
 * (`<slug>/index.html`) so GitHub Pages serves both slashless and trailing-slash legacy URLs.
 */
function githubPagesTrailingSlashRedirects() {
  return {
    name: 'github-pages-trailing-slash-redirects',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        for (const routePath of redirectPaths) {
          const slug = routePath.replace(/^\/|\/$/g, '');
          const htmlFile = path.join(distDir, `${slug}.html`);
          if (!fs.existsSync(htmlFile)) continue;

          const targetDir = path.join(distDir, slug);
          fs.mkdirSync(targetDir, { recursive: true });
          fs.copyFileSync(htmlFile, path.join(targetDir, 'index.html'));
        }
      }
    }
  };
}

export default defineConfig({
  site: 'https://www.capridmc.com',
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  redirects: legacyRedirects,
  devToolbar: {
    enabled: false
  },
  integrations: [
    sitemap({
      lastmod: new Date(),
      serialize(item) {
        const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        if (pathname.includes('404') || item.url.endsWith('.md') || redirectPaths.has(pathname)) {
          return undefined;
        }
        return item;
      }
    }),
    githubPagesTrailingSlashRedirects()
  ],
  vite: {
    plugins: [tailwindcss()],
  }
});
