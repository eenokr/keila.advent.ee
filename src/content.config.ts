import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const buttonSchema = z.object({
	text: z.string(),
	link: z.string(),
	variant: z.enum(['primary', 'secondary']).default('primary'),
	external: z.boolean().default(false),
	ariaLabel: z.string().optional(),
});

const koduleht = defineCollection({
	loader: glob({
		base: './src/content/koduleht',
		pattern: '{avaleht,kogunemised,meist,facebooki-uudised,jutlused-ja-raadiosaated,veebikoolitus,oppetuki-app}.md',
	}),
	schema: z.object({
		title: z.string(),
		eyebrow: z.string().optional(),
		description: z.string().optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		scheduleTitle: z.string().optional(),
		scheduleDescription: z.string().optional(),
		scheduleActivities: z
			.array(
				z.object({
					key: z.enum(['jutlus', 'piiblitund', 'lasteTundRl', 'soomine', 'osasaamine']),
					positiveText: z.string(),
					icon: z.string().optional(),
					iconAlt: z.string().optional(),
				}),
			)
			.optional(),
		buttons: z.array(buttonSchema).optional(),
		cards: z.array(z.object({ title: z.string(), description: z.string(), icon: z.string().optional(), iconAlt: z.string().optional() })).optional(),
		audioSources: z
			.array(
				z.object({
					key: z.enum(['uheskoos', 'sermons']),
					title: z.string(),
					sourceUrl: z.string(),
					buttonText: z.string().default('Kuula veel'),
					image: z.string().optional(),
				}),
			)
			.optional(),
		themes: z.array(z.string()).optional(),
		themesLabel: z.string().optional(),
		order: z.number().default(0),
	}),
});

const sermons = defineCollection({
	loader: glob({ base: './src/content/sermons', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		category: z.string().default('Audiojutlus'),
		pubDate: z.coerce.date(),
		audioUrl: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

const contact = defineCollection({
	loader: glob({ base: './src/content/koduleht', pattern: 'kontakt.md' }),
	schema: z.object({
		title: z.string(),
		eyebrow: z.string().optional(),
		description: z.string().optional(),
		cardTitle: z.string(),
		fields: z.object({
			serviceTime: z.string(),
			bibleStudyTime: z.string(),
			address: z.string(),
			pastor: z.string(),
			phone: z.string(),
			email: z.string(),
		}),
		serviceTime: z.string(),
		bibleStudyTime: z.string(),
		address: z.string(),
		mapTitle: z.string().optional(),
		mapEmbedUrl: z.string().optional(),
		pastor: z.string(),
		phone: z.string(),
		phoneHref: z.string(),
		email: z.string(),
	}),
});

const site = defineCollection({
	loader: glob({ base: './src/content/koduleht', pattern: 'uldinfo.md' }),
	schema: z.object({
		title: z.string(),
		titleLine1: z.string(),
		titleLine2: z.string(),
		description: z.string(),
		logoImage: z.string(),
		logoAlt: z.string(),
		mobileMenuText: z.string(),
		headerCta: z.object({ text: z.string(), href: z.string() }),
		footerText: z.string(),
		footerContact: z.string(),
		footerCopyright: z.string(),
		nav: z.array(z.object({
			label: z.string(),
			href: z.string().optional(),
			children: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
		})),
		socials: z.array(z.object({ label: z.string(), href: z.string(), type: z.enum(['facebook', 'instagram', 'youtube']) })).default([]),
	}),
});

export const collections = { koduleht, sermons, contact, site };
