# Graph Report - keila.advent.ee  (2026-05-30)

## Corpus Check
- 51 files · ~205,255 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 285 nodes · 329 edges · 47 communities (42 shown, 5 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4c5fcf0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Church Org & Content Sources|Church Org & Content Sources]]
- [[_COMMUNITY_Homepage & Content Assembly|Homepage & Content Assembly]]
- [[_COMMUNITY_Content Routing & Widgets|Content Routing & Widgets]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_SEO & Metadata|SEO & Metadata]]
- [[_COMMUNITY_Service Schedule Parsing|Service Schedule Parsing]]
- [[_COMMUNITY_Google Drive Sync|Google Drive Sync]]
- [[_COMMUNITY_Image Carousel|Image Carousel]]
- [[_COMMUNITY_Animated Image Scroller|Animated Image Scroller]]
- [[_COMMUNITY_Advent Audio Feed|Advent Audio Feed]]
- [[_COMMUNITY_Advent Logo Brand|Advent Logo Brand]]
- [[_COMMUNITY_Congregation Logo|Congregation Logo]]
- [[_COMMUNITY_Communion Icon|Communion Icon]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Church Building Photo|Church Building Photo]]
- [[_COMMUNITY_Üheskoos Radio Show|Üheskoos Radio Show]]
- [[_COMMUNITY_Worship Service Icon|Worship Service Icon]]
- [[_COMMUNITY_Apple Touch Icon|Apple Touch Icon]]
- [[_COMMUNITY_Site Favicon|Site Favicon]]
- [[_COMMUNITY_Claude Code Settings|Claude Code Settings]]
- [[_COMMUNITY_Bible Icon|Bible Icon]]
- [[_COMMUNITY_Childrens Class Icon|Childrens Class Icon]]
- [[_COMMUNITY_Small Favicon|Small Favicon]]
- [[_COMMUNITY_VSCode Editor Config|VSCode Editor Config]]
- [[_COMMUNITY_Claude Launch Config|Claude Launch Config]]
- [[_COMMUNITY_Lock Icon|Lock Icon]]
- [[_COMMUNITY_Communal Meal Icon|Communal Meal Icon]]
- [[_COMMUNITY_VSCode Extensions|VSCode Extensions]]
- [[_COMMUNITY_VSCode Launch Config|VSCode Launch Config]]
- [[_COMMUNITY_Responsive Image Component|Responsive Image Component]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `../../components/PeaMeta.astro` - 18 edges
2. `Keila Adventkogudus Project README` - 14 edges
3. `../GaleriiKarussell.astro` - 13 edges
4. `../../components/Pais.astro` - 12 edges
5. `Keila Adventkogudus` - 10 edges
6. `../components/sections/HingamispaevakooliVidin.astro` - 9 edges
7. `Jutlused ja Raadiosaated (Audio) Section` - 9 edges
8. `scripts` - 8 edges
9. `../TegevusNupp.astro` - 6 edges
10. `getServiceScheduleItems()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `robots.txt / Sitemap Config` --references--> `Seitsmenda Paeva Adventistide Keila Kogudus (Organization)`  [INFERRED]
  public/robots.txt → README.md
- `Seitsmenda Paeva Adventistide Keila Kogudus (Organization)` --conceptually_related_to--> `Hingamispäevakool (Sabbath School Bible Study)`  [INFERRED]
  README.md → src/content/koduleht/oppetuki-app.md
- `Seitsmenda Paeva Adventistide Keila Kogudus (Organization)` --conceptually_related_to--> `Usk ja elu Veebikursus (12-episode online course)`  [INFERRED]
  README.md → src/content/koduleht/veebikoolitus.md
- `Keila Adventkogudus Project README` --references--> `Avaleht (Home Page Hero) Section`  [EXTRACTED]
  README.md → src/content/koduleht/avaleht.md
- `Keila Adventkogudus Project README` --references--> `Facebooki Uudised / Miks Jeesus? Section`  [EXTRACTED]
  README.md → src/content/koduleht/facebooki-uudised.md

## Hyperedges (group relationships)
- **CI/CD Build and Deploy Pipeline: Drive Sync + Astro Build + FTP Deploy** — concept_google_drive_sync, concept_static_site_astro, concept_ftp_deploy_pipeline, concept_google_sheets_schedule [EXTRACTED 1.00]
- **Avaleht Ordered Content Sections** — koduleht_avaleht, koduleht_kogunemised, koduleht_meist, koduleht_facebooki_uudised, koduleht_jutlused_ja_raadiosaated, koduleht_veebikoolitus, koduleht_oppetuki_app [EXTRACTED 1.00]
- **February 2026 Sermon Series** — sermons_jumala_rahu, sermons_keset_tormi, sermons_hea_karjane, sermons_palved_ja_palvevastused, sermons_usu_sotsiaalne_moode, sermons_uhtsus [INFERRED 0.85]

## Communities (47 total, 5 thin omitted)

### Community 0 - "Church Org & Content Sources"
Cohesion: 0.11
Nodes (28): advent.ee Audio Source, CI/CD FTP Deploy Pipeline, Google Drive Image Sync (sync-drive.mjs), Google Sheets Kogunemiste Kuupaevad, Hingamispäevakool (Sabbath School Bible Study), Seitsmenda Paeva Adventistide Keila Kogudus (Organization), Marge Randlepp (Pastor), Mervi Cederström (Theologian / Course Author) (+20 more)

### Community 1 - "Homepage & Content Assembly"
Cohesion: 0.09
Nodes (22): adventAudioBlocks, audioItemsByKey, communitySlides, koduleht, orderedKoduleheEntries, visibleContactItems, ../FacebookiVoog.astro, ../Infokaart.astro (+14 more)

### Community 2 - "Content Routing & Widgets"
Cohesion: 0.25
Nodes (8): activeIndex, futureQuarters, nextCovers, now, pastIds, QUARTERS, thisSat, ../components/sections/HingamispaevakooliVidin.astro

### Community 3 - "Package Dependencies"
Cohesion: 0.10
Nodes (18): dependencies, astro, @astrojs/mdx, @astrojs/sitemap, sharp, engines, node, name (+10 more)

### Community 4 - "SEO & Metadata"
Cohesion: 0.07
Nodes (28): iconPaths, today, clamp(), lerp(), update(), canonicalURL, emailItem, imageURL (+20 more)

### Community 5 - "Service Schedule Parsing"
Cohesion: 0.20
Nodes (9): DATE_COLUMN_CANDIDATES, findColumn(), findDateColumn(), getServiceScheduleItems(), MONTHS, parseCsv(), ParsedScheduleItem, selectRelevantItems() (+1 more)

### Community 6 - "Google Drive Sync"
Cohesion: 0.33
Nodes (9): downloadFile(), FOLDERS, isCacheFresh(), listImages(), main(), readManifest(), syncFolder(), WIDTHS (+1 more)

### Community 7 - "Image Carousel"
Cohesion: 0.38
Nodes (9): getTrackIndex(), preloadNearby(), setActiveSlide(), setDragOffset(), snapToRealSlide(), startTimer(), stopTimer(), updateSlidePosition() (+1 more)

### Community 8 - "Animated Image Scroller"
Cohesion: 0.11
Nodes (18): Avaldamine (deploy), Avalehe sektsioonid, Enne pushimist, Google Drive piltide sünk, Jutlused ja raadiosaated, Keila Adventkogudus, Kes me oleme, Kogunemiste kuupäevad (+10 more)

### Community 9 - "Advent Audio Feed"
Cohesion: 0.31
Nodes (7): ADVENT_AUDIO_SOURCES, AdventAudioItem, cleanText(), decodeHtml(), extractAudioCards(), fetchHtml(), getAdventAudioItems()

### Community 10 - "Advent Logo Brand"
Cohesion: 0.60
Nodes (6): Open Bible Symbol, Advent Logo, Cross Symbol, Flame Symbol, Orange Brand Color, Seventh-day Adventist Church

### Community 11 - "Congregation Logo"
Cohesion: 0.53
Nodes (6): Keila Kogudus Logo, Burnt Orange / Sienna Brand Color, Keila Kogudus (Keila Congregation), Seitsmenda Päeva Adventistid (Seventh-day Adventists), SDA Flame and Bible Icon, Seitsmenda Päeva Adventistide Keila Kogudus

### Community 12 - "Communion Icon"
Cohesion: 0.53
Nodes (6): Bread/Plate, Chalice, Church Sacrament, Communion (Lord's Supper), Cross, Communion Icon

### Community 13 - "TypeScript Config"
Cohesion: 0.33
Nodes (5): compilerOptions, strictNullChecks, exclude, extends, include

### Community 14 - "Church Building Photo"
Cohesion: 0.60
Nodes (5): Church Building Photo, Church Entrance with Steps and Ramp, Urban Residential Neighborhood, Church Sign on Building Facade, Small White Wooden Church Building

### Community 15 - "Üheskoos Radio Show"
Cohesion: 0.70
Nodes (5): Üheskoos Stuudio Photo, Man Host, Üheskoos Show, Radio Studio, Woman Host

### Community 16 - "Worship Service Icon"
Cohesion: 0.60
Nodes (5): Church Building, Cross Symbol, Church Service Icon, Church Steeple, Worship / Church Service

### Community 17 - "Apple Touch Icon"
Cohesion: 0.50
Nodes (5): Cross, Flame Symbol, Apple Touch Icon, Open Bible, Seventh-day Adventist Church

### Community 18 - "Site Favicon"
Cohesion: 0.50
Nodes (5): Seventh-day Adventist Brand Identity, Favicon, Orange Color Style, Open Book Symbol, Flame Symbol

### Community 19 - "Claude Code Settings"
Cohesion: 0.50
Nodes (3): permissions, additionalDirectories, allow

### Community 20 - "Bible Icon"
Cohesion: 0.67
Nodes (4): Bible (Book), Church Website, Cross Symbol, Bible Icon

### Community 21 - "Childrens Class Icon"
Cohesion: 0.83
Nodes (4): Three Children Visual Motif, Children's Hour Church Event, Children's Hour Icon, Open Book Visual Motif

### Community 22 - "Small Favicon"
Cohesion: 0.83
Nodes (4): Seventh-day Adventist Church Logo, Open Book Symbol, Flame/Fire Symbol, Favicon 32x32

### Community 23 - "VSCode Editor Config"
Cohesion: 0.50
Nodes (3): editor.fontSize, window.density.editorTabHeight, window.zoomLevel

### Community 25 - "Lock Icon"
Cohesion: 0.67
Nodes (3): Terracotta Brown Color (#AF6F4E), Lock Icon, Minimalist Style

### Community 26 - "Communal Meal Icon"
Cohesion: 1.00
Nodes (3): Food Icon, Communal Meal Image, Pizza Slice Icon

## Knowledge Gaps
- **110 isolated node(s):** `name`, `type`, `version`, `node`, `sync` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../../components/PeaMeta.astro` connect `SEO & Metadata` to `Homepage & Content Assembly`, `Package Dependencies`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Church Org & Content Sources` be split into smaller, more focused modules?**
  _Cohesion score 0.10846560846560846 - nodes in this community are weakly interconnected._
- **Should `Homepage & Content Assembly` be split into smaller, more focused modules?**
  _Cohesion score 0.09116809116809117 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `SEO & Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.06507936507936508 - nodes in this community are weakly interconnected._
- **Should `Animated Image Scroller` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._