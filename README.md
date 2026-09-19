# WebScale Starter Kit

Wewnętrzny, data-driven starter kit WebScale do tworzenia stron klientów w Astro. Każdy klient otrzymuje osobną kopię projektu. To repozytorium nie jest produktem do bezpośredniej sprzedaży.

## Szybki start

```powershell
npm ci
npm run dev
```

Przed zakończeniem zadania uruchom:

```powershell
npm run verify
```

Polecenie `verify` uruchamia testy, kontrole struktury, kontrolę danych, build oraz audyty wyniku produkcyjnego.

## Jak działa projekt

```text
src/data/pages/*.json
        |
        v
src/pages/[...page].astro -> PageBuilder.astro
        |                         |
        |                         v
        +--------------> section-registry + component-map
                                  |
                                  v
                        src/components/registry/*.astro
                                  |
                                  v
                         src/data/sections/*.json
```

Konfiguracja strony wybiera kolejność sekcji i warianty. `PageBuilder` odnajduje komponent w registry i przekazuje mu dane z `dataKey`. Nie tworzymy osobnego pliku Astro dla każdej zwykłej strony.

## Najważniejsze katalogi

| Katalog | Odpowiedzialność |
|---|---|
| `src/data/global/` | Dane firmy, SEO i ustawienia globalne |
| `src/data/navigation/` | Header, footer i nawigacja |
| `src/data/pages/` | Konfiguracje stron, SEO, kolejność sekcji |
| `src/data/sections/` | Treści i dane bloków |
| `src/components/ui/` | Atomy, molekuły, layouty i wzorce UI |
| `src/components/registry/` | Bloki renderowane przez `PageBuilder` |
| `src/components/dev/` | Biblioteka komponentów i narzędzia developerskie |
| `src/config/` | Registry, manifest, mapowanie i kontrakty |
| `src/pages/` | Trasy Astro, w tym trasy dev i QA |
| `src/styles/` | Style ładowane przez `src/styles/global.css` |
| `src/scripts/` | Generatory, audyty i kontrole jakości |

Komponenty React znajdujące się bezpośrednio w `src/components/ui/` są używane głównie przez Studio i narzędzia wewnętrzne. Produkcyjne komponenty Astro znajdują się w podkatalogach `atoms`, `molecules`, `layout` i `patterns`.

## Źródła prawdy

- Domena i zakres builda: `site.config.mjs`.
- Dane strony: `src/data/pages/*.json`.
- Dane globalne i treści sekcji: `src/data/**/*.json`.
- Publiczne komponenty: `src/config/component-manifest.ts`.
- Dostępne sekcje i warianty: `src/config/section-registry.ts`.
- Rozwiązanie nazwy komponentu: `src/config/component-map.ts`.
- Style globalne: `src/styles/global.css`.
- Kontrakty danych: `src/config/data-contracts.ts`.

`public/admin/config.yml` jest zwykłym plikiem konfiguracyjnym Sveltia CMS i jest śledzony przez Git. Po jego zmianie uruchom `npm run cms:check`.

## Typowe zadania

### Dodanie lub zmiana strony

1. Utwórz albo zmień `src/data/pages/[slug].json`.
2. Wybierz istniejące `id` i `variant` z section registry.
3. Dodaj dane sekcji w `src/data/sections/`, jeśli wariant wymaga `dataKey`.
4. Uruchom `npm run verify`.

### Dodanie nowego bloku

Przeczytaj [workflow dodawania sekcji](.docs/workflows/add-registry-section.md). Nowy blok wymaga komponentu Astro, wpisu w manifest, wpisu w domenowym module section registry, danych JSON oraz testu kontraktowego, jeśli struktura jest istotna dla działania.

### Zmiana stylów

Najpierw sprawdź `src/styles/README.md`, `DESIGN_RULES.md` i aktywny plik `design/*.md`. Głównym punktem importu jest `src/styles/global.css`. Plik `src/styles/core.css` nie istnieje w aktualnej architekturze.

Tailwind jest domyślnym sposobem stylizacji layoutu, odstępów, responsywności i układu bloku. CSS jest ostatecznością dla tokenów, wspólnych systemów, pseudo-elementów i złożonych animacji.

## Komendy jakości

| Komenda | Zastosowanie |
|---|---|
| `npm run test` | Testy Vitest |
| `npm run check:types` | Diagnostyka Astro i TypeScript |
| `npm run check:registrations` | Manifest, registry i pliki komponentów |
| `npm run check:data` | Kontrakty danych stron i sekcji |
| `npm run build` | Czysty build produkcyjny |
| `npm run check:build-output` | Brak tras i odnośników developerskich w `dist` |
| `npm run verify` | Pełna lokalna bramka jakości |
| `npm run qa:client` | Kontrola przed oddaniem kopii klienta |

Profile QA i ręczne scenariusze opisuje [QA-RUNBOOK.md](.docs/QA-RUNBOOK.md). Zasady pracy wielu developerów znajdują się w [CONTRIBUTING.md](CONTRIBUTING.md).

## Stack

- Astro 7
- Tailwind CSS v4
- TypeScript
- Sveltia CMS
- Vitest
