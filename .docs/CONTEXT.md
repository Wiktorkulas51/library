# Project Context: Starter Kit

Starter Kit jest wewnętrzną bazą Astro do tworzenia kopii stron WebScale. Projekt jest data-driven, korzysta z PageBuildera, JSON, Sveltia CMS, Tailwind CSS v4 i TypeScript.

## Aktualna architektura

```text
src/data/pages/*.json
  -> src/pages/[...page].astro
  -> src/components/PageBuilder.astro
  -> src/config/section-registry.ts
  -> src/config/component-map.ts
  -> src/components/registry/*.astro
  -> src/data/sections/*.json
```

- `src/data/pages/` definiuje strony, SEO, kolejność sekcji i warianty.
- `src/data/sections/` przechowuje dane przekazane przez `dataKey`.
- `src/components/PageBuilder.astro` rozwiązuje sekcję, wariant, komponent i dane.
- `src/config/section-registry.ts` jest publicznym wejściem do rejestru sekcji i wariantów.
- `src/config/component-manifest.ts` określa publiczne bloki oraz kategorię `core`, `client`, `catalog` lub `legacy`.
- `src/config/component-map.ts` mapuje wpisy manifestu na komponenty Astro.
- `src/components/dev/` zawiera wyłącznie lokalną bibliotekę komponentów i narzędzia.
- `src/studio/` zawiera logikę konfiguratora, bez publicznej trasy Studio.

## Warstwy UI

- Astro UI znajduje się w `src/components/ui/atoms/`, `molecules/`, `layout/` i `patterns/`.
- React UI znajduje się głównie bezpośrednio w `src/components/ui/` i obsługuje Studio oraz narzędzia wewnętrzne.
- Bloki PageBuildera znajdują się w `src/components/registry/`.
- Główny import stylów to `src/styles/global.css`. Aktualny podział stylów opisuje `src/styles/README.md`.

## Źródła prawdy

| Zakres | Plik |
|---|---|
| Domena, template i BUILD_SCOPE | `site.config.mjs` |
| Firma i SEO | `src/data/global/` |
| Header i footer | `src/data/navigation/` |
| Strony | `src/data/pages/` |
| Dane bloków | `src/data/sections/` |
| Publiczne komponenty | `src/config/component-manifest.ts` |
| Sekcje i warianty | `src/config/section-registry.ts` |
| Kontrakty | `src/config/data-contracts.ts` |
| Style | `src/styles/global.css` |

## Weryfikacja

Podstawową bramką jest `npm run verify`. Uruchamia ona testy, diagnostykę TypeScript, kontrole danych i rejestracji, czysty build, kontrolę wyniku produkcyjnego, linków, obrazów i SEO.

Build czyści `dist` przed generowaniem oraz przywraca pliki tymczasowo przeniesione do `_disabled`. Po buildzie `check:build-output` wymaga pustego `_disabled` i blokuje trasy developerskie w wyniku.

## Zasady zmian

1. Najpierw użyj istniejącego bloku i atomów.
2. Treść przechowuj w JSON, a nie w komponentach.
3. Nowy blok dodaj do manifestu, domenowego modułu section registry i danych.
4. Dodaj test kontraktowy, jeśli blok ma ważną strukturę lub interakcję.
5. Po zmianie uruchom `npm run verify`.

Instrukcja dla człowieka znajduje się w `CONTRIBUTING.md`. Instrukcje dla agentów AI znajdują się w rootowym `AGENTS.md`.
