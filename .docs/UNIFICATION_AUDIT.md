# UNIFICATION_AUDIT.md

Audyt unifikacji infrastruktury: 9 projektów klienckich (aleksandra-klisik, filip-halucha, lean-creative, marek-jodlowski, mklegal, Paweł Kubacki, promix, przemyslaw-stalanowski, tymoteusz-juszczak) + porównanie strukturalne tom-ros. Data: 2026-08-01.

## Metoda

- 5 subagentów przeanalizowało ~3000 commitów (git log + git show) pod kątem powtarzających się zmian infrastrukturalnych
- Każdy temat oceniony: stan w starter-kicie (TAK/NIE/CZĘŚCIOWO) + ryzyko powtórki
- tom-ros porównany strukturalnie (brak git)

## Luki do portu (stan na 2026-08-01)

| # | Temat | Dowód powtórki | Stan w starter-kicie | Status |
|---|-------|---------------|----------------------|--------|
| 1 | Cache busting assetów | aleksandra 6x, tymoteusz 4x | NIE, entryFileNames bez hasha | DONE (astro.config.mjs: [name]-[hash]) |
| 2 | Guardy skryptów po View Transitions | mklegal 4x, lean 5x, tymoteusz 13x | NIE, brak __lenisBooted/__animationsBooted/data-astro-rerun | DONE (lenis.js, motion.js, Layout.astro) |
| 3 | Wstrzykiwanie analityki po zgodzie (Clarity/GA4/GTM) | brak u wszystkich, każdy pisze od zera | CZĘŚCIOWO, puste pola w seo.json, brak kodu | DONE (analytics.js + define:vars + seo.json clarityId) |
| 4 | Plik og-image | tymoteusz 3+ fixy, reszta brak | CZĘŚCIOWO, seo.json wskazuje nieistniejący plik | DONE (public/og-image.svg, seo.json defaultOgImage) |
| 5 | clean-dist: _assets/ i component-map.css | mklegal, stalanowski, lean | NIE, nadal w toRemove | DONE (usunięte z toRemove + komentarz) |
| 6 | CSP frame-src dla map | mklegal, stalanowski, filip | NIE, brak www.google.com/OSM | DONE (google.com, maps.google.com, openstreetmap.org) |
| 7 | Wspólny ContactForm.astro z AJAX | tymoteusz ~20, lean, marek | CZĘŚCIOWO, tylko send-form.php | DONE (ContactForm.astro + form-handler statusy) |
| 8 | Walidacja polskich znaków/pauz w buildzie | stalanowski 7x, marek 3x | NIE, tylko zasada w AGENTS.md | DONE (check-polish.ts + check:polish) |
| 9 | .gitattributes (LF) | mklegal 1x, problem powtarzalny | NIE, brak wszędzie | DONE (.gitattributes: eol=lf + binary) |
| 10 | noindex env-aware (Netlify/staging) | stalanowski, marek | NIE, brak import.meta.env.NETLIFY | DONE (Layout.astro: isStaging) |
| 11 | Cache CI: src/**/*.json + restore-keys | stalanowski, marek | NIE w deploy.yml | DONE (deploy.yml: Cache CMS data + restore-keys) |
| 12 | CMS: pola ukryte, unicode slugi, hinty wymiarów | marek 13, stalanowski 19 | CZĘŚCIOWO | DONE (config.yml + backend GitHub) |
| 13 | Handler kotwic Lenis + data-lenis-prevent | stalanowski, tymoteusz | CZĘŚCIOWO | DONE (lenis.js: prevent + before-swap) |
| 14 | Google Reviews: MIN_RATING + workflow weekly | stalanowski 8 | CZĘŚCIOWO | DONE (MIN_RATING 4.0 + reviews-weekly.yml) |
| 15 | Testy send-form.php + konfiguracja maili | Paweł Kubacki | NIE | DONE (scripts/test-send-form.mjs + test:form; SKIP bez PHP) |

## Już ujednolicone (nie ruszać)

Deploy FTP/push (46 commitów w marek+stalanowski!), VersionToolbar, favicony, fonty, cookie consent, SEO meta/robots/sitemap, 404, legal pages, check-registrations, optimize-images, live.js DEV guard, MobileDrawer, .github workflow, prune-studio.

## Obserwacje procesowe

- Projekty w różnych generacjach: promix (maj 2026) nie ma .docs, tom-ros 95% zsynchronizowany, tylko mklegal ma pełny komplet dokumentacji. robocopy propaguje stan w dół, brak backportów.
- Bezpieczeństwo: w repo Paweł Kubacki commitowane credentiale FTP (d856eeb). Zasada: secrets tylko w .env.
- Revert ping-pong na treściach klienta (stalanowski, 36 commitów): przywracać treści klienta 1:1, nie generować od nowa.

## Zasada

Po każdym porcie do starter-kita: zaktualizuj ten plik (status na DONE + commit), zweryfikuj buildem (`npm run build` w starter-kicie), potem propagacja do nowych klientów przez robocopy jest automatyczna.
