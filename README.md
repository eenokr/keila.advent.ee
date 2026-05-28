# Keila Adventkoguduse koduleht

See on Seitsmenda Päeva Adventistide Keila Koguduse Astro koduleht. Leht on staatiline, ehitatakse GitHub Actionsiga ja avaldatakse GitHub Pagesis domeenil `https://keila.randlepp.ee`.

## Käivitamine

```bash
npm install
npm run dev
npm run build
```

`npm run dev` avab kohaliku arendusserveri. `npm run build` kontrollib, et leht ehitub korrektselt.

## Avaldamine

Leht avaldatakse automaatselt, kui muudatused pushitakse `main` harusse. Töövoog asub failis `.github/workflows/pages.yml` ja kasutab Node.js 22 versiooni.

GitHub Pages peab olema seadistatud nii:

- Settings -> Pages
- Source: GitHub Actions
- Custom domain: `keila.randlepp.ee`

Fail `public/CNAME` hoiab custom domaini deploy järel alles.

## Mini-CMS

Muudetav sisu on Markdown-failides kaustas `src/content/koduleht/`. Kujundust ja komponente ei pea tavaliselt muutma.

## Lehe ja tekstide suurused

Lehe osade laiused, vahed, kaartide mõõdud ja tähtsamad tekstisuurused on koondatud ühte faili:

```text
src/styles/suurused.css
```

Seal saad muuta näiteks hero pealkirja suurust, sektsioonide vahekaugusi, nuppude suurust, päise logo suurust, kaartide suurust, Facebooki voo laiust, kontaktkaardi ja Google Mapsi kõrgust ning audio kaartide tekstisuurusi. Muuda eelkõige selle faili `:root` väärtusi ja jäta komponendid ise võimalusel puutumata.

### Üldinfo, päis ja jalus

Muuda faili:

```text
src/content/koduleht/uldinfo.md
```

Seal on saidi pealkiri, logo alt-tekst, navigatsioon, päise nupp, jaluse tekst ja sotsiaalmeedia lingid.

### Avalehe osad

Avalehe sektsioonid on eraldi failides:

```text
src/content/koduleht/avaleht.md
src/content/koduleht/kogunemised.md
src/content/koduleht/meist.md
src/content/koduleht/facebooki-uudised.md
src/content/koduleht/jutlused-ja-raadiosaated.md
src/content/koduleht/veebikoolitus.md
src/content/koduleht/oppetuki-app.md
```

Igas failis olev `order` määrab sektsiooni järjekorra avalehel. Väiksem number tuleb eespool.

### Kontakt

Kontaktiosa tekstid, aadress ja Google Mapsi link on siin:

```text
src/content/koduleht/kontakt.md
```

### Teated hero pildi alal

Teadete slaider võtab pildid automaatselt siit:

```text
src/assets/galerii/
```

Uue teate lisamiseks lisa sinna uus `jpg`, `jpeg`, `png` või `webp` pilt. Mummude arv tekib automaatselt piltide arvu järgi.

### Kogunemiste kuupäevad

Järgmiste kogunemiste kaardid tulevad buildi ajal Google Sheetsi CSV failist. Tekstid ja ikoonid, mida kaartidel kasutatakse, on failis:

```text
src/content/koduleht/kogunemised.md
```

Andmeid uuendatakse siis, kui leht uuesti ehitatakse ja deploytakse.

### Raadiosaated ja jutlused

Audio kaardid tulevad buildi ajal Advent.ee lehtedelt. Seadistus on failis:

```text
src/content/koduleht/jutlused-ja-raadiosaated.md
```

Ka need uuenevad lehe uuesti ehitamisel.

## Pildid ja ikoonid

Kasuta neid kaustu:

```text
src/assets/images/          üldised lehe pildid
src/assets/icons/           teenistuse ja tegevuste ikoonid
src/assets/branding/        logo
src/assets/galerii/         pildid avalehe slaideris
public/                     faviconid, CNAME ja muud otse serveeritavad failid
```

Pildifailide nimed võiksid olla väikeste tähtedega, ilma tühikute ja täpitähtedeta. Hea näide: `kiriku-pilt.jpg`.

## Google Drive piltide sünkroon

Galerii ja teadete pildid loetakse buildi ajal automaatselt Google Drive'i kaustadest. Skript asub `scripts/sync-drive.mjs` ja jookseb enne `astro build` (npm `prebuild` hook).

### Seadistus

Lisa projekti juurde `.env` fail (see on gitignore'i taga — ära commit-i):

```
DRIVE_API_KEY=AIzaSy...sinu_võti...
```

Hostingus (nt GitHub Actions) lisa samanimeline environment variable.

### Käsitsi käivitamine

```bash
npm run sync
```

Skript laeb pildid alla `public/koduka/galerii/` ja `public/koduka/teated/` ning loob/uuendab manifestifailid `src/data/koduka-galerii.json` ja `src/data/koduka-teated.json`.

### Kasutamine Astro lehel

```astro
---
import galerii from '../data/koduka-galerii.json';
import ResponsiveImage from '../components/ResponsiveImage.astro';
---

<div class="galerii">
  {galerii.map((img) => (
    <ResponsiveImage
      variants={img.variants}
      width={img.width}
      height={img.height}
      alt={img.alt}
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  ))}
</div>
```

Teated samamoodi `src/data/koduka-teated.json`-iga.

### Veatõrkeotsing

- **403** → Drive kaust pole avalik. Sea jagamine: "Anyone with the link → Viewer".
- **400** → Vale API võti või kausta ID.

## Enne pushimist

Käivita:

```bash
npm run build
```

Kui build õnnestub, on muudatused üldjuhul turvaline commitida ja pushida.
