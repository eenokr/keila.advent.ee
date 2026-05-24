import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const buttonSchema = z.object({
	text: z.string(),
	link: z.string(),
	variant: z.enum(['primary', 'secondary']).default('primary'),
	external: z.boolean().default(false),
	ariaLabel: z.string().optional(),
});

const homepage = defineCollection({
	loader: glob({ base: './src/content/homepage', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		eyebrow: z.string().optional(),
		description: z.string().optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		buttons: z.array(buttonSchema).optional(),
		cards: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
		categories: z.array(z.string()).optional(),
		categoriesLabel: z.string().optional(),
		groups: z
			.array(
				z.object({
					key: z.enum(['articles', 'sermons', 'health']),
					eyebrow: z.string(),
					title: z.string(),
				}),
			)
			.optional(),
		formatsLabel: z.string().optional(),
		themes: z.array(z.string()).optional(),
		themesLabel: z.string().optional(),
		order: z.number().default(0),
	}),
});

const articles = defineCollection({
	loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.string(),
		pubDate: z.coerce.date(),
		image: z.string().optional(),
		draft: z.boolean().default(false),
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

const ministry = defineCollection({
	loader: glob({ base: './src/content/ministry', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		order: z.number().default(0),
	}),
});

const contact = defineCollection({
	loader: glob({ base: './src/content/contact', pattern: '**/*.md' }),
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
		pastor: z.string(),
		phone: z.string(),
		phoneHref: z.string(),
		email: z.string(),
	}),
});

const announcements = defineCollection({
	loader: glob({ base: './src/content/announcements', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		link: z.string().optional(),
	}),
});

const site = defineCollection({
	loader: glob({ base: './src/content/site', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		titleLine1: z.string(),
		titleLine2: z.string(),
		description: z.string(),
		logoImage: z.string(),
		logoAlt: z.string(),
		headerCta: z.object({ text: z.string(), href: z.string() }),
		footerText: z.string(),
		footerContact: z.string(),
		footerCopyright: z.string(),
		nav: z.array(z.object({ label: z.string(), href: z.string() })),
		socials: z.array(z.object({ label: z.string(), href: z.string(), type: z.enum(['facebook', 'instagram', 'youtube']) })).default([]),
		hero: z.object({
			eyebrow: z.string().optional(),
			title: z.string(),
			description: z.string(),
			image: z.string().optional(),
			imageAlt: z.string().optional(),
			buttons: z.array(buttonSchema).optional(),
		}),
		services: z.object({
			eyebrow: z.string().optional(),
			title: z.string(),
			cards: z.array(z.object({ title: z.string(), description: z.string() })),
		}),
		about: z.object({
			eyebrow: z.string().optional(),
			title: z.string(),
			description: z.string(),
			image: z.string().optional(),
			imageAlt: z.string().optional(),
		}),
		facebook: z.object({
			eyebrow: z.string().optional(),
			title: z.string(),
			description: z.string(),
			buttons: z.array(buttonSchema).optional(),
		}),
		resources: z.object({
			eyebrow: z.string().optional(),
			title: z.string(),
			description: z.string(),
			categories: z.array(z.string()).optional(),
			categoriesLabel: z.string().optional(),
			groups: z.array(z.object({ key: z.enum(['articles', 'sermons', 'health']), eyebrow: z.string(), title: z.string() })).optional(),
			formatsLabel: z.string().optional(),
		}),
		course: z.object({
			eyebrow: z.string().optional(),
			title: z.string(),
			description: z.string(),
			buttons: z.array(buttonSchema).optional(),
			themes: z.array(z.string()).optional(),
			themesLabel: z.string().optional(),
		}),
		app: z.object({
			eyebrow: z.string().optional(),
			title: z.string(),
			description: z.string(),
			buttons: z.array(buttonSchema).optional(),
		}),
		contact: z.object({
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
			pastor: z.string(),
			phone: z.string(),
			phoneHref: z.string(),
			email: z.string(),
		}),
	}),
});

export const collections = { homepage, articles, sermons, ministry, contact, announcements, site };
