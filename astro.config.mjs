// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	// Lehe peamine (kanooniline) domeen. SITE_URL keskkonnamuutuja saab seda vajadusel
	// üle kirjutada (nt eelvaate-deploy), aga vaikimisi kasutab nii CI kui lokaalne build
	// keila.advent.ee, et sitemap ja kanoonilised lingid osutaks õigele domeenile.
	site: process.env.SITE_URL || 'https://keila.advent.ee',
	base: '/',
	output: 'static',
	integrations: [mdx(), sitemap()],
});
