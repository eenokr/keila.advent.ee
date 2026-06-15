// scripts/sync-facebook.mjs
//
// Tõmbab build-i ajal Facebooki lehe värskeimad postitused Graph API kaudu ja
// kirjutab need src/data/facebook-posts.json faili. Astro komponent
// FacebookiPostitused.astro renderdab need staatilisena (ei vaja browseris
// otseühendust Facebookiga, töötab ka cross-site tracking blokeeringuga).
//
// Jookseb automaatselt enne "astro dev"/"astro build" (vt package.json
// "predev"/"prebuild").
//
// Vajalikud keskkonnamuutujad (vt .env lokaalselt, GitHub Secrets CI-s):
//   FB_PAGE_TOKEN  - Page Access Token (pages_read_engagement, pages_show_list)
//   FB_APP_ID      - Meta App ID (tokeni pikendamiseks)
//   FB_APP_SECRET  - Meta App Secret (tokeni pikendamiseks)
//   FB_PAGE_ID     - Facebooki lehe ID (vaikimisi Keila adventkogudus)
//   GH_TOKEN       - GitHub Personal Access Token "Secrets: write" õigusega
//                     (CI-s, et uuendatud token salvestada tagasi sekretiks)
//
// Kui FB_PAGE_TOKEN puudub (nt kontributoril kohalikus arenduses), jätab
// sünk vahele ja kasutab olemasolevat (commititud) faili.

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

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

const GRAPH_API = 'https://graph.facebook.com/v25.0';
const OUT_FILE = 'src/data/facebook-posts.json';
const POST_LIMIT = 5;
const REFRESH_THRESHOLD_S = 7 * 24 * 60 * 60; // uuenda, kui alla 7 päeva alles

const PAGE_ID = process.env.FB_PAGE_ID || '525341971179805'; // Keila adventkogudus
const TOKEN = process.env.FB_PAGE_TOKEN;
const APP_ID = process.env.FB_APP_ID;
const APP_SECRET = process.env.FB_APP_SECRET;

async function ensureOutputExists() {
  try {
    await fs.access(OUT_FILE);
  } catch {
    await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
    await fs.writeFile(OUT_FILE, JSON.stringify({ fetchedAt: null, posts: [] }, null, 2) + '\n');
  }
}

// Kontrollib, kui kaua token veel kehtib. Kui jääb alla nädala (või token
// ise ei tea oma aegumist), vahetab selle uue 60-päevase tokeni vastu.
async function getFreshToken(token) {
  if (!APP_ID || !APP_SECRET) return token;

  try {
    const debugRes = await fetch(
      `${GRAPH_API}/debug_token?input_token=${encodeURIComponent(token)}` +
        `&access_token=${APP_ID}|${APP_SECRET}`
    );
    if (!debugRes.ok) return token;
    const debugData = await debugRes.json();
    const expiresAt = debugData?.data?.expires_at ?? 0;

    if (expiresAt !== 0) {
      const secondsLeft = expiresAt - Math.floor(Date.now() / 1000);
      if (secondsLeft > REFRESH_THRESHOLD_S) {
        return token; // veel piisavalt kehtiv
      }
    } else {
      return token; // expires_at = 0 tähendab "ei aegu ajaliselt"
    }
  } catch (err) {
    console.warn('Facebook tokeni kontroll ebaõnnestus, jätkan vana tokeniga:', err.message);
    return token;
  }

  console.log('Facebook token aegumas - vahetan uue vastu...');
  try {
    const exchangeRes = await fetch(
      `${GRAPH_API}/oauth/access_token?grant_type=fb_exchange_token` +
        `&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${encodeURIComponent(token)}`
    );
    if (!exchangeRes.ok) {
      console.warn('Facebook tokeni vahetus ebaõnnestus, jätkan vana tokeniga.');
      return token;
    }
    const exchangeData = await exchangeRes.json();
    const newToken = exchangeData.access_token;
    if (!newToken) return token;

    await persistTokenToGithub(newToken);
    return newToken;
  } catch (err) {
    console.warn('Facebook tokeni vahetus ebaõnnestus, jätkan vana tokeniga:', err.message);
    return token;
  }
}

// Salvestab uue tokeni tagasi GitHubi repo secret'iks "FB_PAGE_TOKEN", et
// järgmised buildid kasutaksid juba uut tokenit. Vajab GH_TOKEN env muutujat
// (Personal Access Token, "Secrets: write" õigusega).
async function persistTokenToGithub(newToken) {
  if (process.env.CI !== 'true') {
    console.log('Uus Facebook token saadud (kohalik käivitus, secret\'i ei uuendata).');
    return;
  }
  if (!process.env.GH_TOKEN) {
    console.warn(
      'Uus Facebook token saadud, aga GH_TOKEN puudub - secret\'i FB_PAGE_TOKEN ' +
        'automaatset uuendust jäeti vahele. Vana token kehtib veel kuni varasema ' +
        'aegumiseni, aga tasub GH_TOKEN seadistada (vt README).'
    );
    return;
  }
  try {
    execSync('gh secret set FB_PAGE_TOKEN', {
      input: newToken,
      stdio: ['pipe', 'inherit', 'inherit'],
      env: process.env,
    });
    console.log('GitHub secret "FB_PAGE_TOKEN" uuendatud uue tokeniga.');
  } catch (err) {
    console.warn('GitHub secret\'i "FB_PAGE_TOKEN" uuendamine ebaõnnestus:', err.message);
  }
}

async function fetchPosts(token) {
  const fields = 'message,created_time,permalink_url,full_picture';
  const url =
    `${GRAPH_API}/${PAGE_ID}/posts?fields=${fields}&limit=${POST_LIMIT}` +
    `&access_token=${encodeURIComponent(token)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Facebooki postituste laadimine ebaõnnestus (${res.status}): ${body}`);
  }
  const data = await res.json();

  return (data.data ?? [])
    .filter((post) => post.message || post.full_picture)
    .map((post) => ({
      id: post.id,
      message: post.message ?? '',
      createdTime: post.created_time,
      permalinkUrl: post.permalink_url,
      image: post.full_picture ?? null,
    }));
}

async function main() {
  if (!TOKEN) {
    console.log('FB_PAGE_TOKEN puudub - jätan Facebooki postituste süngi vahele.');
    await ensureOutputExists();
    return;
  }

  try {
    const token = await getFreshToken(TOKEN);
    const posts = await fetchPosts(token);
    await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
    await fs.writeFile(
      OUT_FILE,
      JSON.stringify({ fetchedAt: new Date().toISOString(), posts }, null, 2) + '\n'
    );
    console.log(`Facebooki postitused (${posts.length}) salvestatud faili ${OUT_FILE}.`);
  } catch (err) {
    console.warn('Facebooki postituste sünk ebaõnnestus, kasutan eelmist tulemust:', err.message);
    await ensureOutputExists();
  }
}

await main();
