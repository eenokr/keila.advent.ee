# Keila Adventkogudus

[keila.advent.ee](https://keila.advent.ee)

## Kes me oleme

Oleme **Seitsmenda Päeva Adventistide Keila Kogudus** — kristlik kogukond Keilas, aadressil
Põllu 5. Jumalateenistused toimuvad **laupäeviti kell 11.00** ja igaüks on oodatud. Koguduse
pastor on Marge Randlepp.

Soovime olla toeks vaimulikul teekonnal ning aidata kasvada usus, lootuses ja armastuses. Sellel
lehel on info jumalateenistuste ja sündmuste kohta, jutlused ja raadiosaated kuulamiseks,
piiblitundide materjalid ning „Usk ja elu" veebikursus.

- **Aadress:** Põllu 5, Keila, Harjumaa
- **Jumalateenistus:** laupäeviti kell 11.00
- **E-post:** keila@advent.ee · **Telefon:** +372 5656 2131
- **Facebook:** [KeilaSPA](https://www.facebook.com/KeilaSPA/) ·
  **YouTube:** [@keilaadventkogudus3623](https://www.youtube.com/@keilaadventkogudus3623)

## Mis projekt see on

See on koguduse kodulehe lähtekood. Leht on ehitatud [Astroga](https://astro.build/) ja on
**staatiline** (puhas HTML/CSS/JS, ilma serveripoolse loogikata). Sisu hoitakse Markdown-failides,
mida saab muuta ka ilma programmeerimisoskuseta. Pildid tõmmatakse build-ajal Google Drive'ist ja
teisendatakse automaatselt teravaks WebP-ks. Iga muudatus `main` harus ehitatakse ja laetakse
automaatselt FTP kaudu veebiserverisse domeenil **keila.advent.ee**.

## Käivitamine

```bash
npm install     # paigalda sõltuvused (üks kord)
npm run dev      # käivita kohalik arendusserver
npm run build    # ehita leht (kontrollib, et kõik ehitub korrektselt)
npm run preview  # vaata ehitatud lehte lokaalselt
```

`npm run dev` ja `npm run build` käivitavad enne tööd automaatselt Google Drive'i piltide süngi
(vt allpool). Selleks on vaja `.env` faili `DRIVE_API_KEY`-ga.

## Avaldamine (deploy)

Leht avaldatakse **automaatselt**, kui muudatused pushitakse `main` harusse. Töövoog asub failis
`.github/workflows/ftp-deploy.yml` (Node.js 22) ja teeb järgmist:

1. tõmbab värsked pildid Drive'ist, kogunemiste kuupäevad Google Sheetsist ja audio advent.ee-st;
2. ehitab lehe (`dist/`);
3. laeb FTP kaudu serverisse **ainult muutunud failid**.

Sama töövoog käib ka kord ööpäevas (cron) ja seda saab käsitsi käivitada GitHubi *Actions* tabist.

**Vajalikud GitHubi „secrets"** (Settings → Secrets and variables → Actions):

| Secret | Selgitus |
| --- | --- |
| `FTP_SERVER` | FTP serveri aadress |
| `FTP_USERNAME` | FTP kasutajanimi |
| `FTP_PASSWORD` | FTP parool |
| `DRIVE_API_KEY` | Google Drive API võti piltide süngiks |

Serveris kuhu leht laetakse, määrab `server-dir` (vaikimisi `./`). Kui hostingu juurkaust on nt
`public_html/`, `www/` või `htdocs/`, muuda see väärtus töövoo failis.

## Sisu muutmine

Muudetav sisu on Markdown-failides kaustas `src/content/koduleht/`. Kujundust ja komponente ei pea
tavaliselt puutuma.

### Üldinfo, päis ja jalus — `src/content/koduleht/uldinfo.md`

Saidi pealkiri, logo alt-tekst, navigatsioon, päise nupp, jaluse tekst ja sotsiaalmeedia lingid.

### Avalehe sektsioonid

Iga sektsioon on eraldi failis; `order` määrab järjekorra avalehel (väiksem number eespool):

```text
src/content/koduleht/avaleht.md
src/content/koduleht/kogunemised.md
src/content/koduleht/meist.md
src/content/koduleht/facebooki-uudised.md
src/content/koduleht/jutlused-ja-raadiosaated.md
src/content/koduleht/veebikoolitus.md
src/content/koduleht/oppetuki-app.md
```

### Kontakt — `src/content/koduleht/kontakt.md`

Kontaktiosa tekstid, aadress ja Google Mapsi link. Tühja `value`-ga ridu lehel ei kuvata.

### Kogunemiste kuupäevad

Järgmiste kogunemiste kaardid loetakse build-ajal Google Sheetsi CSV-st. Kaartidel kasutatavad
tekstid ja ikoonid on failis `src/content/koduleht/kogunemised.md`. Andmed uuenevad lehe uuesti
ehitamisel.

### Jutlused ja raadiosaated

Audio kaardid tulevad build-ajal advent.ee lehtedelt; seadistus failis
`src/content/koduleht/jutlused-ja-raadiosaated.md`. Eraldi jutluselehed on kaustas
`src/content/sermons/`.

## Suurused ja kujundus

Lehe laiused, vahed, kaartide mõõdud ja tähtsamad tekstisuurused on koondatud ühte faili:

```text
src/styles/suurused.css
```

Muuda eelkõige selle faili `:root` väärtusi (nt hero pealkirja suurus, sektsioonide vahed, nuppude
suurus, päise logo, kontaktkaardi ja kaardi kõrgus) ja jäta komponendid ise võimalusel puutumata.
Värvid ja üldised stiilid on `src/styles/global.css`-is.

## Pildid ja ikoonid

```text
src/assets/branding/   logod ja üldised brändipildid (kirik, stuudio)
src/assets/icons/      jumalateenistuse ja tegevuste ikoonid
public/koduka/         Drive'ist süngitud galerii- ja teadete pildid (genereeritud)
public/                faviconid ja muud otse serveeritavad failid (nt robots.txt)
```

Kõik komponentide kaudu kuvatavad pildid optimeeritakse build-ajal **WebP**-ks, teravat kvaliteeti
säilitades. Pildifailide nimed võiksid olla väikeste tähtedega, ilma tühikute ja täpitähtedeta
(nt `kiriku-pilt.jpg`).

## Google Drive piltide sünk

Galerii ja teadete pildid loetakse build-ajal kahest avalikust Google Drive'i kaustast. Skript
`scripts/sync-drive.mjs` laeb pildid alla, teisendab need mitmes laiuses WebP-ks ja kirjutab
manifestid. See käivitub automaatselt enne `dev` ja `build` käske (npm `predev`/`prebuild`).

### Seadistus

Lisa projekti juurde `.env` fail (gitignore'i taga — ära commit-i):

```
DRIVE_API_KEY=AIzaSy...sinu_võti...
```

GitHub Actionsis on sama võti `DRIVE_API_KEY` secret'ina.

### Käsitsi käivitamine

```bash
npm run sync
```

Pildid laetakse `public/koduka/galerii/` ja `public/koduka/teated/` ning manifestid
`src/data/koduka-galerii.json` ja `src/data/koduka-teated.json` luuakse/uuendatakse. Drive'i kaustad
peavad olema jagatud „Anyone with the link → Viewer".

### Veatõrkeotsing

- **403** → Drive kaust pole avalik. Sea jagamine: „Anyone with the link → Viewer".
- **400** → vale API võti või kausta ID.

## Enne pushimist

Käivita `npm run build`. Kui build õnnestub, on muudatused üldjuhul turvaline commit-ida ja
`main` harusse pushida — sealt deployitakse leht automaatselt.
