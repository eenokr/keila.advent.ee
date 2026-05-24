# Pildid ja MDX

## Millal kasutada `src/assets/images/`

Kasuta `src/assets/images/` kausta sisupiltide jaoks: koguduse fotod, artiklite pildid, ülistuse pildid, galeriide valitud pildid ja muud lehe sees kuvatavad fotod.

Need pildid saab Astro buildi ajal optimeerida `astro:assets` abil. See annab väiksemad failid, responsive variandid ja parema Lighthouse tulemuse.

Failinimed hoia lihtsad:

- väiksed tähed
- sõnade vahel sidekriipsud
- ilma tühikute ja Eesti erimärkideta
- näiteks `kiriku-pilt.jpg`, mitte `kiriku pilt.JPG`

## Millal kasutada `public/`

Kasuta `public/` kausta failide jaoks, mida peab serveerima täpselt sama nimega otse juurest:

- `favicon.svg`
- `favicon.ico`
- `apple-touch-icon.png`
- muud brauseri või välise teenuse poolt otse küsitavad staatilised failid

Ära pane tavalisi artikli- või avalehe fotosid `public/images/` kausta, kui neid saab importida `src/assets/images/` kaudu.

## Kuidas lisada pilti MDX artiklisse

1. Pane pilt kausta `src/assets/images/`.
2. Loo või muuda artiklit kaustas `src/content/articles/`.
3. Kui artiklis on vaja optimeeritud pilti, kasuta `.mdx` faili.

Näide:

```mdx
---
title: "Miks peaksin minema kirikusse?"
description: "Lühike kirjeldus artiklist."
category: "Piibel"
pubDate: 2026-01-01
image: "kiriku-pilt.jpg"
---

import OptimizedImage from '../../components/OptimizedImage.astro';
import kirikuPilt from '../../assets/images/kiriku-pilt.jpg';

Artikli tekst algab siit.

<OptimizedImage
  src={kirikuPilt}
  alt="Keila adventkoguduse hoone"
  caption="Keila adventkogudus"
/>
```

## `OptimizedImage` props

`src` ja `alt` on kohustuslikud.

```mdx
<OptimizedImage
  src={kirikuPilt}
  alt="Kirjeldav alt tekst"
  caption="Valikuline pildiallkiri"
/>
```

Soovi korral saab lisada:

- `widths={[640, 960, 1200]}`
- `sizes="(max-width: 760px) calc(100vw - 40px), 760px"`
- `class="oma-klass"`

## Enne pushimist

Käivita:

```bash
npm run build
```

Kui lisasid MDX toe esimest korda uues masinas, paigalda sõltuvused:

```bash
npm install
```
