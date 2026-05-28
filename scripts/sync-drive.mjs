// scripts/sync-drive.mjs
//
// Tõmbab build-i ajal Google Drive avalikest kaustadest pildid alla,
// optimeerib WebP-ks mitmes laiuses ja kirjutab manifesti.
// Jookseb automaatselt enne "astro build" (vt package.json "prebuild").
// Nõuab: Node 18+ ja "sharp" paketti.
//
// Võti loetakse keskkonnamuutujast DRIVE_API_KEY (vt .env).

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

try {
  const env = fsSync.readFileSync('.env', 'utf-8');
  for (const line of env.split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
} catch {}

const API_KEY = process.env.DRIVE_API_KEY;

const FOLDERS = [
  { id: '1SE4Ocd1V12H8vriApZbgn2iqTEtyMRlh', key: 'galerii' }, // Koduka_galerii
  { id: '1CQh_hBc8_IjKVyjV8oVuxHT9ZubIdJa_', key: 'teated' },  // Koduka_teated
];

const WIDTHS = [400, 800, 1600];
const WEBP_QUALITY = 92;
const PUBLIC_DIR = 'public/koduka';
const DATA_DIR = 'src/data';
const API = 'https://www.googleapis.com/drive/v3';

async function listImages(folderId) {
  const files = [];
  let pageToken;
  do {
    const q = encodeURIComponent(
      `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`
    );
    const url =
      `${API}/files?q=${q}&key=${API_KEY}` +
      `&fields=nextPageToken,files(id,name,mimeType,modifiedTime)` +
      `&pageSize=1000` +
      (pageToken ? `&pageToken=${pageToken}` : '');
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `Drive listimine ebaõnnestus (${res.status}). ` +
          `Kontrolli API võtit ja et kaust on "Anyone with the link -> Viewer".\n${body}`
      );
    }
    const data = await res.json();
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return files;
}

async function downloadFile(fileId) {
  const url = `${API}/files/${fileId}?alt=media&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Faili ${fileId} allalaadimine ebaõnnestus (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

async function readManifest(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8'));
  } catch {
    return [];
  }
}

async function syncFolder({ id, key }) {
  const outDir = path.join(PUBLIC_DIR, key);
  const manifestFile = path.join(DATA_DIR, `koduka-${key}.json`);
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  const old = await readManifest(manifestFile);
  const oldById = new Map(old.map((e) => [e.id, e]));

  const files = await listImages(id);
  console.log(`[${key}] leitud ${files.length} pilti Drive-ist`);

  const manifest = [];

  for (const f of files) {
    const existing = oldById.get(f.id);
    if (existing && existing.modifiedTime === f.modifiedTime) {
      const allExist = await Promise.all(
        existing.variants.map((v) =>
          fs.access(path.join('public', v.src)).then(() => true).catch(() => false)
        )
      );
      if (allExist.every(Boolean)) {
        console.log(`[${key}] vahele (muutmata): ${f.name}`);
        manifest.push(existing);
        continue;
      }
    }

    console.log(`[${key}] töötlen: ${f.name}`);
    const buf = await downloadFile(f.id);
    const meta = await sharp(buf, { failOn: 'none' }).metadata();
    const origW = meta.width ?? Math.max(...WIDTHS);
    const origH = meta.height ?? 0;

    const targetWidths = WIDTHS.filter((w) => w <= origW);
    if (targetWidths.length === 0) targetWidths.push(origW);

    const variants = [];
    for (const w of targetWidths) {
      const outName = `${f.id}-${w}.webp`;
      await sharp(buf, { failOn: 'none' })
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(outDir, outName));
      variants.push({ w, src: `/koduka/${key}/${outName}` });
    }

    const largest = Math.max(...targetWidths);
    const height = origW ? Math.round((origH * largest) / origW) : origH;

    manifest.push({
      id: f.id,
      name: f.name,
      alt: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      modifiedTime: f.modifiedTime,
      width: largest,
      height,
      variants,
    });
  }

  const liveIds = new Set(files.map((f) => f.id));
  const onDisk = await fs.readdir(outDir).catch(() => []);
  for (const file of onDisk) {
    const fileId = file.split('-').slice(0, -1).join('-');
    if (!liveIds.has(fileId)) {
      await fs.unlink(path.join(outDir, file)).catch(() => {});
      console.log(`[${key}] kustutasin (kadunud Drive-ist): ${file}`);
    }
  }

  await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2));
  console.log(`[${key}] valmis -> ${manifestFile} (${manifest.length} pilti)`);
}

async function main() {
  if (!API_KEY) {
    console.error(
      '\n  X DRIVE_API_KEY puudub.\n' +
        '    Lisa see .env faili (lokaalselt) või hostingu env muutujatesse.\n'
    );
    process.exit(1);
  }
  for (const folder of FOLDERS) {
    await syncFolder(folder);
  }
  console.log('\nOK Kõik kaustad sünkroonitud.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
