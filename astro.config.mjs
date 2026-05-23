// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://keila-advent-ee.vercel.app',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Atkinson Hyperlegible',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
		},
	],
});