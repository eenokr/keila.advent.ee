// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	// Vaikimisi GitHub Pages domeen. FTP-deploy build seab SITE_URL=https://keila.advent.ee,
	// et sitemap ja kanoonilised lingid osutaks õigele domeenile.
	site: process.env.SITE_URL || 'https://keila.randlepp.ee',
	base: '/',
	output: 'static',
	integrations: [mdx(), sitemap()],
});
