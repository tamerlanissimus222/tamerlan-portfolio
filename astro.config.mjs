import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const productionBase = repository ? `/${repository}` : '/';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL ?? 'https://tamerlanissimus222.github.io',
  base: process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS ? productionBase : '/'),
  trailingSlash: 'never',
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
