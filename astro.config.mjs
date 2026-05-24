// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { base } from './vite.config.js';

const owner = process.env.GITHUB_REPOSITORY_OWNER;

export default defineConfig({
	site: owner ? `https://${owner}.github.io` : 'https://keila.advent.ee',
	base,
	output: 'static',
	integrations: [sitemap()],
});
