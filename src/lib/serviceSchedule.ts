import scheduleData from '../data/service-schedule.json';

export interface ServiceScheduleItem {
	date: string;
	jutlus: boolean;
	piiblitund: boolean;
	lasteTundRl: boolean;
	soomine: boolean;
	osasaamine: boolean;
}

interface CachedScheduleItem {
	dateValue: string;
	jutlus: boolean;
	piiblitund: boolean;
	lasteTundRl: boolean;
	soomine: boolean;
	osasaamine: boolean;
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat('et-EE', {
		day: 'numeric',
		month: 'long',
	}).format(date);
}

function selectRelevantItems(items: { dateValue: Date }[], limit: number) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const upcomingItems = items.filter((item) => item.dateValue >= today);
	const pastItems = items.filter((item) => item.dateValue < today).reverse();

	return [...upcomingItems, ...pastItems].slice(0, limit);
}

// Andmed tõmmatakse build'i eel scripts/sync-schedule.mjs poolt (vt package.json
// "predev"/"prebuild") ja kirjutatakse src/data/service-schedule.json faili.
// Kui Sheetsi tõmbamine build'i ajal ebaõnnestub, jääb sellesse faili eelmine
// õnnestunud tulemus, nii et kastid ei kao lehelt ühegi võrgutõrke tõttu.
export function getServiceScheduleItems(limit = 4): ServiceScheduleItem[] {
	const items = ((scheduleData as { items: CachedScheduleItem[] }).items ?? []).map((item) => ({
		...item,
		dateValue: new Date(item.dateValue),
	}));

	return selectRelevantItems(items, limit).map(({ dateValue, ...item }) => ({
		...item,
		date: formatDate(dateValue),
	}));
}
