// scripts/sync-schedule.mjs
//
// Tõmbab build-i ajal Google Sheetsist jumalateenistuste toimumise aegade
// CSV-i, parsib selle ja kirjutab src/data/service-schedule.json faili.
// src/lib/serviceSchedule.ts loeb selle faili (ei tee enam live fetch'i
// build'i sees), nii et kui Sheets on hetkeks kättesaamatu (Google'i
// rate limit, võrgutõrge CI runneris), kasutatakse viimast õnnestunud
// tõmmatud tulemust selle asemel, et kastid lihtsalt kaoksid.
//
// Jookseb automaatselt enne "astro dev"/"astro build" (vt package.json
// "predev"/"prebuild").

import fs from 'node:fs/promises';
import path from 'node:path';

const CSV_URL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOmThNzJymlMrI5PiXxN5jcQTAotZvXrbYCZwDWQ8s2fqvbOckV6-XjCFkyUulLYUUl0HOqpyYIxrO/pub?gid=1165865253&single=true&output=csv';
const OUT_FILE = 'src/data/service-schedule.json';

const MONTHS = {
	jan: 0, jaanuar: 0,
	feb: 1, veebr: 1, veebruar: 1,
	mar: 2, mär: 2, marts: 2, märts: 2,
	apr: 3, aprill: 3,
	may: 4, mai: 4,
	jun: 5, juun: 5, juuni: 5,
	jul: 6, juul: 6, juuli: 6,
	aug: 7, august: 7,
	sep: 8, sept: 8, september: 8,
	oct: 9, okt: 9, oktoober: 9,
	nov: 10, november: 10,
	dec: 11, dets: 11, detsember: 11,
};

const DATE_COLUMN_CANDIDATES = ['date', 'kuupaev', 'kuupäev', 'paev', 'päev'];

function parseCsv(csv) {
	const rows = [];
	let cell = '';
	let row = [];
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

function normalizeColumnName(value) {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]/g, '');
}

function findColumn(headers, candidates) {
	const normalizedCandidates = candidates.map(normalizeColumnName);
	return headers.findIndex((header) => normalizedCandidates.includes(normalizeColumnName(header)));
}

function findDateColumn(headers, rows) {
	const candidateIndex = findColumn(headers, DATE_COLUMN_CANDIDATES);
	if (candidateIndex >= 0) return candidateIndex;
	return headers.findIndex((_, index) => rows.some((row) => parseDate(row[index])));
}

function isHappening(value) {
	const normalizedValue = value?.trim();
	return Boolean(normalizedValue && normalizedValue !== '-');
}

function parseDate(value) {
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

async function ensureOutputExists() {
	try {
		await fs.access(OUT_FILE);
	} catch {
		await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
		await fs.writeFile(OUT_FILE, JSON.stringify({ fetchedAt: null, items: [] }, null, 2) + '\n');
	}
}

async function fetchScheduleItems() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);

	try {
		const response = await fetch(CSV_URL, { signal: controller.signal });
		if (!response.ok) {
			throw new Error(`Sheets CSV laadimine ebaõnnestus (${response.status})`);
		}

		const csv = await response.text();
		const [headers, ...rows] = parseCsv(csv);
		if (!headers?.length || !rows.length) {
			throw new Error('CSV oli tühi või ilma päiseta');
		}

		const dateColumn = findDateColumn(headers, rows);
		const jutlusColumn = findColumn(headers, ['Jutlus']);
		const piiblitundColumn = findColumn(headers, ['Piiblitund', 'Piibli tund', 'HPK']);
		const lasteTundRlColumn = findColumn(headers, ['Laste-tund / RL', 'Lastetund', 'Laste tund', 'RL']);
		const soomineColumn = findColumn(headers, ['Söö-mine', 'Soomine', 'Söömine']);
		const osasaamineColumn = findColumn(headers, ['Osa-saa-mine', 'Osasaamine', 'Osa saamine']);

		if (dateColumn < 0) {
			throw new Error('Kuupäeva veergu ei leitud');
		}

		const items = rows
			.map((row) => {
				const dateValue = parseDate(row[dateColumn]);
				if (!dateValue) return undefined;

				return {
					dateValue: dateValue.toISOString(),
					jutlus: isHappening(row[jutlusColumn]),
					piiblitund: isHappening(row[piiblitundColumn]),
					lasteTundRl: isHappening(row[lasteTundRlColumn]),
					soomine: isHappening(row[soomineColumn]),
					osasaamine: isHappening(row[osasaamineColumn]),
				};
			})
			.filter((item) => Boolean(item))
			.sort((a, b) => new Date(a.dateValue).valueOf() - new Date(b.dateValue).valueOf());

		if (!items.length) {
			throw new Error('CSV-st ei leitud ühtegi kehtivat kuupäevaga rida');
		}

		return items;
	} finally {
		clearTimeout(timeout);
	}
}

async function main() {
	try {
		const items = await fetchScheduleItems();
		await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
		await fs.writeFile(
			OUT_FILE,
			JSON.stringify({ fetchedAt: new Date().toISOString(), items }, null, 2) + '\n'
		);
		console.log(`Jumalateenistuste toimumise ajad (${items.length}) salvestatud faili ${OUT_FILE}.`);
	} catch (err) {
		console.error(
			'⚠️  HOIATUS: Jumalateenistuste toimumise aegade sünk ebaõnnestus, kasutan eelmist tulemust:',
			err.message
		);
		await ensureOutputExists();
	}
}

await main();
