export interface ServiceScheduleItem {
	date: string;
	jutlus: boolean;
	piiblitund: boolean;
	lasteTundRl: boolean;
	soomine: boolean;
	osasaamine: boolean;
}

interface ParsedScheduleItem extends ServiceScheduleItem {
	dateValue: Date;
}

const MONTHS: Record<string, number> = {
	jan: 0,
	jaanuar: 0,
	feb: 1,
	veebr: 1,
	veebruar: 1,
	mar: 2,
	mär: 2,
	marts: 2,
	märts: 2,
	apr: 3,
	aprill: 3,
	may: 4,
	mai: 4,
	jun: 5,
	juun: 5,
	juuni: 5,
	jul: 6,
	juul: 6,
	juuli: 6,
	aug: 7,
	august: 7,
	sep: 8,
	sept: 8,
	september: 8,
	oct: 9,
	okt: 9,
	oktoober: 9,
	nov: 10,
	november: 10,
	dec: 11,
	dets: 11,
	detsember: 11,
};

const DATE_COLUMN_CANDIDATES = ['date', 'kuupaev', 'kuupäev', 'paev', 'päev'];

function parseCsv(csv: string) {
	const rows: string[][] = [];
	let cell = '';
	let row: string[] = [];
	let insideQuotes = false;

	for (let index = 0; index < csv.length; index += 1) {
		const char = csv[index];
		const nextChar = csv[index + 1];

		if (char === '"') {
			if (insideQuotes && nextChar === '"') {
				cell += '"';
				index += 1;
			} else {
				insideQuotes = !insideQuotes;
			}
		} else if (char === ',' && !insideQuotes) {
			row.push(cell);
			cell = '';
		} else if ((char === '\n' || char === '\r') && !insideQuotes) {
			if (char === '\r' && nextChar === '\n') index += 1;
			row.push(cell);
			if (row.some((value) => value.trim())) rows.push(row);
			cell = '';
			row = [];
		} else {
			cell += char;
		}
	}

	row.push(cell);
	if (row.some((value) => value.trim())) rows.push(row);

	return rows;
}

function normalizeColumnName(value: string) {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]/g, '');
}

function findColumn(headers: string[], candidates: string[]) {
	const normalizedCandidates = candidates.map(normalizeColumnName);

	return headers.findIndex((header) => normalizedCandidates.includes(normalizeColumnName(header)));
}

function findDateColumn(headers: string[], rows: string[][]) {
	const candidateIndex = findColumn(headers, DATE_COLUMN_CANDIDATES);
	if (candidateIndex >= 0) return candidateIndex;

	return headers.findIndex((_, index) => rows.some((row) => parseDate(row[index])));
}

function isHappening(value?: string) {
	const normalizedValue = value?.trim();

	return Boolean(normalizedValue && normalizedValue !== '-');
}

function parseDate(value?: string) {
	if (!value) return undefined;

	const trimmedValue = value.trim();
	const isoDate = new Date(trimmedValue);
	if (!Number.isNaN(isoDate.valueOf()) && /\d{4}/.test(trimmedValue)) {
		return new Date(isoDate.getFullYear(), isoDate.getMonth(), isoDate.getDate());
	}

	const monthNameMatch = trimmedValue.match(/(\d{1,2})\s*\/?\s*([A-Za-zÄÖÕÜŠŽäöõüšž]+)/);
	if (monthNameMatch) {
		const day = Number(monthNameMatch[1]);
		const month = MONTHS[monthNameMatch[2].toLowerCase()];
		if (!Number.isNaN(day) && month !== undefined) {
			return new Date(new Date().getFullYear(), month, day);
		}
	}

	const numericMatch = trimmedValue.match(/(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?/);
	if (numericMatch) {
		const day = Number(numericMatch[1]);
		const month = Number(numericMatch[2]) - 1;
		const year = numericMatch[3] ? Number(numericMatch[3].padStart(4, '20')) : new Date().getFullYear();
		if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
			return new Date(year, month, day);
		}
	}

	return undefined;
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat('et-EE', {
		day: 'numeric',
		month: 'long',
	}).format(date);
}

function selectRelevantItems(items: ParsedScheduleItem[], limit: number) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const upcomingItems = items.filter((item) => item.dateValue >= today);
	const pastItems = items.filter((item) => item.dateValue < today).reverse();

	return [...upcomingItems, ...pastItems].slice(0, limit);
}

export async function getServiceScheduleItems(csvUrl: string, limit = 4): Promise<ServiceScheduleItem[]> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);

	try {
		const response = await fetch(csvUrl, { signal: controller.signal });
		if (!response.ok) return [];

		const csv = await response.text();
		const [headers, ...rows] = parseCsv(csv);
		if (!headers?.length || !rows.length) return [];

		const dateColumn = findDateColumn(headers, rows);
		const jutlusColumn = findColumn(headers, ['Jutlus']);
		const piiblitundColumn = findColumn(headers, ['Piiblitund', 'Piibli tund', 'HPK']);
		const lasteTundRlColumn = findColumn(headers, ['Laste-tund / RL', 'Lastetund', 'Laste tund', 'RL']);
		const soomineColumn = findColumn(headers, ['Söö-mine', 'Soomine', 'Söömine']);
		const osasaamineColumn = findColumn(headers, ['Osa-saa-mine', 'Osasaamine', 'Osa saamine']);

		if (dateColumn < 0) return [];

		const items = rows
			.map((row): ParsedScheduleItem | undefined => {
				const dateValue = parseDate(row[dateColumn]);
				if (!dateValue) return undefined;

				return {
					date: formatDate(dateValue),
					dateValue,
					jutlus: isHappening(row[jutlusColumn]),
					piiblitund: isHappening(row[piiblitundColumn]),
					lasteTundRl: isHappening(row[lasteTundRlColumn]),
					soomine: isHappening(row[soomineColumn]),
					osasaamine: isHappening(row[osasaamineColumn]),
				};
			})
			.filter((item): item is ParsedScheduleItem => Boolean(item))
			.sort((a, b) => a.dateValue.valueOf() - b.dateValue.valueOf());

		return selectRelevantItems(items, limit).map(({ dateValue, ...item }) => item);
	} catch {
		return [];
	} finally {
		clearTimeout(timeout);
	}
}
