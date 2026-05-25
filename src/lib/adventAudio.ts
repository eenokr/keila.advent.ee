export interface AdventAudioItem {
	title: string;
	date?: string;
	url: string;
	audioUrl?: string;
}

export const ADVENT_AUDIO_SOURCES = {
	uheskoos: 'https://advent.ee/audio/kaust/91202/uheskoos/',
	sermons: 'https://advent.ee/audio/kaust/106403/marge-randlepp/',
} as const;

const ADVENT_BASE_URL = 'https://advent.ee';

async function fetchHtml(url: string) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);

	try {
		const response = await fetch(url, { signal: controller.signal });
		if (!response.ok) return '';

		return response.text();
	} catch {
		return '';
	} finally {
		clearTimeout(timeout);
	}
}

function decodeHtml(value: string) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#039;|&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function cleanText(value: string) {
	return decodeHtml(value.replace(/<[^>]*>/g, ''))
		.replace(/\s+/g, ' ')
		.trim();
}

function toAbsoluteUrl(url: string) {
	if (url.startsWith('http')) return url;

	return `${ADVENT_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function extractAudioCards(html: string, limit: number) {
	const listingMatch = html.match(/<div[^>]+id="listing_[^"]*"[^>]*>[\s\S]*?<ul[^>]*class="thumbnails"[^>]*>([\s\S]*?)<\/ul>/);
	const listingHtml = listingMatch?.[1] ?? html;
	const itemMatches = [...listingHtml.matchAll(/<li[^>]*class="[^"]*\bitem\b[^"]*"[^>]*>([\s\S]*?)<\/li>/g)];

	return itemMatches
		.map(([, itemHtml]) => {
			const linkMatch = itemHtml.match(/<h4[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h4>/);
			if (!linkMatch) return undefined;

			const dateMatch = itemHtml.match(/<span[^>]*class="[^"]*\bmuted\b[^"]*"[^>]*>([\s\S]*?)<\/span>/);

			return {
				title: cleanText(linkMatch[2]),
				date: dateMatch ? cleanText(dateMatch[1]) : undefined,
				url: toAbsoluteUrl(decodeHtml(linkMatch[1])),
			};
		})
		.filter((item): item is Omit<AdventAudioItem, 'audioUrl'> => Boolean(item?.title && item.url))
		.slice(0, limit);
}

function extractMp3Url(html: string) {
	const mp3Urls = [
		...html.matchAll(/https:\/\/(?:www\.)?advent\.ee\/fail\/[^"'<>\s]+?\.mp3(?:\?stream=1)?/g),
	].map((match) => decodeHtml(match[0]));

	const downloadUrl = mp3Urls.find((url) => !url.includes('?stream=1'));

	return downloadUrl ?? mp3Urls[0];
}

export async function getAdventAudioItems(folderUrl: string, limit = 3): Promise<AdventAudioItem[]> {
	const folderHtml = await fetchHtml(folderUrl);
	if (!folderHtml) return [];

	const folderItems = extractAudioCards(folderHtml, limit);

	return Promise.all(
		folderItems.map(async (item) => {
			const itemHtml = await fetchHtml(item.url);
			const audioUrl = itemHtml ? extractMp3Url(itemHtml) : undefined;

			return { ...item, audioUrl };
		}),
	);
}
