<!--
  AGENTS.md — indeks nawigacyjny dla AI agentów.

  STRUKTURA:
  1. Co to jest          — kontekst projektu (3-4 zdania)
  2. Komendy             — tabelka npm run ... + kiedy uruchamiać
  3. Struktura projektu  — drzewo src/ z opisami katalogów
  4. Path aliases        — lista aliasów importowych
  5. Żelazne reguły      — 8 fundamentalnych zasad (inline, zawsze widoczne)
  6. Sekcje w registry   — źródło prawdy i zasady klasyfikacji bloków
  7. Dokumentacja        — linki do szczegółowych plików z opisem "kiedy czytać"
  8. Szybki start        — 6 kroków tworzenia strony klienta

  ZASADA: AGENTS.md to GPS, nie encyklopedia. Agent czyta to zawsze.
  Szczegóły (antywzorce, przykłady, detale) są w detailed docs.

  DALSZE ROZWÓJ:
  - Po dodaniu nowych bloków → zaktualizuj registry, mapę komponentów i dane
  - Po nowych komendach → zaktualizuj tabelę "Komendy"
  - Po nowych plikach docs → dodaj wiersz w odpowiedniej sekcji "Dokumentacja"
  - Nie duplikuj treści z innych plików — linkuj zamiast tego
-->

# Starter Kit — przewodnik dla AI

## Co to jest

Modularny, data-driven Astro starter kit do szybkiego uruchamiania stron klientów WebScale. Atomic Design, PageBuilder renderujący strony z konfiguracji JSON, gotowe bloki i motywy per klient przez `data-theme`.

**Root:** `D:\Programy\client-projects\starter-kit`

---

## Komendy

| Komenda | Kiedy uruchamiać |
|---------|-----------------|
| `npm run dev` | Dev server (zawsze działa w tle) |
| `npm run build` | Build produkcyjny |
| `npm run design:sync` | Po zmianie tokenów w `design/*.md` → sync do CSS |
| `npm run check:atomic` | **Po każdej zmianie komponentów** — wykrywa antywzorce |
| `npm run check:imports` | Sprawdza hierarchię importów i path aliases |
| `npm run check:registrations` | **Po dodaniu nowego bloku** — weryfikuje rejestrację |
| `npm run check:build-output` | Sprawdza czysty wynik produkcyjny i brak tras dev |
| `npm run qa` | Standardowy gate QA (przed commit) |
| `npm run verify` | Alias pełnej bramki QA dla człowieka i CI |
| `npm run qa:strict` | Przed mergem do mastera |

---

## Struktura projektu

```
src/
├── components/
│   ├── ui/
│   │   ├── atoms/          # Bazowe komponenty Astro
│   │   ├── molecules/      # Wspólne kompozycje Astro
│   │   ├── layout/         # Layouty Astro
│   │   └── *.tsx           # Komponenty React UI dla Studio i narzędzi
│   ├── registry/           # 171 publicznych bloków Astro używanych przez PageBuilder
│   ├── decorations/        # Dekoracje: BlurGlow, FloatingShapes, GradientOrb itd.
│   ├── dev/                # Narzędzia dev: VersionToolbar (warianty UI, patrz VERSION_TOOLBAR.md)
│
├── config/
│   ├── section-registry.ts # Rejestr wszystkich sekcji + wariantów (SSOT)
│   ├── component-manifest.ts # Jawna lista publicznych bloków i ich klasyfikacja
│   └── component-map.ts    # Mapa komponentów (import → nazwa)
├── data/
│   ├── pages/*.json        # Konfiguracja stron (kolejność sekcji + warianty)
│   ├── sections/**/*.json  # Treści sekcji (dane do bloków)
│   └── global/*.json       # Navbar, footer, dane firmy
├── styles/
│   ├── global.css          # Jedyny punkt wejścia do stylów
│   ├── foundations.css     # Reset, baza i płynne przewijanie
│   ├── components.css      # Systemy `.ui-*`
│   ├── motion.css          # Reveal i reduced motion
│   └── themes.css          # Motywy per `data-theme`
└── pages/                  # Astro pages (catch-all router)
```

---

## Path aliases

| Alias | Ścieżka |
|-------|---------|
| `@/` | `src/` |
| `@components/` | `src/components/` |
| `@layouts/` | `src/layouts/` |
| `@data/` | `src/data/` |
| `@styles/` | `src/styles/` |
| `@utils/` | `src/utils/` |
| `@config/` | `src/config/` |

---

## Żelazne reguły

### 1. Zero hardcodu tekstu
Żadna linijka tekstu nie może być w `.astro`, `.tsx`, `.ts` ani `.css`. Wszystko w `src/data/` (JSON). Komponenty używają tylko `{data.field}` lub `{content.field}`.

### 2. Zero hardcodu kolorów
Nigdy `text-[#333]`, `bg-blue-500` itd. Tylko tokeny: `text-brand-primary`, `ui-bg-page`, `text-brand-dark/60`.

### 3. Tylko atomowe komponenty
Nigdy surowy `<section>`, `<p>`, `<h1-h6>`. Zawsze: `Section.astro`, `Container.astro`, `Heading.astro`, `Text.astro`, `Button.astro`.

### 4. Mobile-first
Bazowe klasy Tailwind = mobile. `md:`, `lg:` = desktop. Używaj `clamp()` zamiast `text-2xl lg:text-4xl`.

### 5. Rejestracja nowych bloków
Po dodaniu publicznego `.astro` w `src/components/registry/`:
1. Dodaj wpis z kategorią w `src/config/component-manifest.ts`.
2. Dodaj sekcję w odpowiednim module `src/config/section-registry/`.
3. Dodaj dane w `src/data/sections/[id].json` albo w odpowiednim podkatalogu.
4. Uruchom `npm run check:registrations`.

### 6. Tailwind first, CSS jako ostateczność
Tailwind jest domyślnym sposobem stylizacji layoutu, odstępów, responsywności i jednorazowych decyzji wizualnych. CSS w `src/styles/` stosuj dla tokenów, wspólnych systemów, pseudo-elementów i złożonych animacji. Scoped CSS dodaj tylko wtedy, gdy utility i istniejące komponenty nie wystarczają.

### 7. Po zmianach zawsze
```bash
npm run check:atomic && npm run check:imports
```

### 8. Path aliases zamiast `../`
Używaj `@components/`, `@data/` itd. Wyjątek: importy w obrębie tego samego katalogu (`./`).

---

## Sekcje w registry

| Sekcja | Warianty (defaultVersion) |
|--------|--------------------------|
| **Hero** | default |
| **Features** | default |
| **About** | default |
| **Marquee** | default |
| **Portfolio** | bento, carousel, categorized, marquee, double-marquee, masonry |
| **FAQ** | flat, simple, grid, list, grouped |
| **Testimonials** | marquee |
| **Contact** | default, split, map, simple |
| **Blog** | list |
| **Calculator** | default |
| **Process** | timeline, cards, numbered |
| **Gallery** | default |
| **Navbar** | centered, floating, local |
| **Footer** | columns, minimal, promo |
| **Theme** | default |
| **ShadcnDemo** | showcase |

Aktualny registry ma 165 wpisów w `src/config/section-registry.ts` i 171 publicznych plików bloków Astro w `src/components/registry/`. Plik `section-registry.ts` jest źródłem prawdy dla identyfikatorów, wariantów, `dataKey` i grup Studio. `component-manifest.ts` jest źródłem prawdy dla publicznych plików i klasyfikacji `core`, `client`, `catalog`, `legacy`, a `component-map.ts` mapuje manifest na implementacje używane przez PageBuilder.

Manifest klasyfikuje bloki bez przenoszenia plików. `client` oznacza blok powiązany z konkretnym projektem, `catalog` oznacza blok demonstracyjny lub studyjny, `legacy` jest zarezerwowane dla bloków wycofanych z aktywnego użycia, a `core` obejmuje bloki ogólne. Nie przenoś bloków wyłącznie na podstawie nazwy pliku.

Pełna mapa komponentów i aktualne przykłady: `COMPONENTS.md`

---

## Dokumentacja szczegółowa

### Architektura i zasady
| Plik | Kiedy czytać |
|------|-------------|
| `CONTEXT.md` | Pełna architektura, feature'y, dual purpose, path aliases |
| `AI_STANDARDS.md` | Szczegółowe antywzorce z przykładami (pill badges, pulsing dots, fake quotes, animation-fill-mode itd.) |
| `AI_GUIDE.md` | Motywy, buttony, animacje, layouty, tokeny designu, komendy |
| `COMPONENTS.md` | Kompletna mapa komponentów z propami i przykładami |
| `CONTENT_ARCHITECTURE.md` | Dane stron, sekcji i globalnego shellu |

### Tworzenie stron i bloków
| Plik | Kiedy czytać |
|------|-------------|
| `WIREFRAME_WORKFLOW.md` | Tworzę stronę klienta od zera (3-fazowy workflow) |
| `BLOCK_FIRST_WORKFLOW.md` | Buduję nowy blok (3 warstwy: struktura, semantyka, styl) |
| `workflows/add-registry-section.md` | Dodaję nową sekcję krok po kroku |

### Design i styling
| Plik | Kiedy czytać |
|------|-------------|
| `design/*.md` (w root projektu) | Tokeny klienta (gold, blush, fix-bud, default) |
| `STARWIND.md` | Sprawdzam historyczny status Starwind UI przed dodaniem zależności |
| `ASSETS_GUIDE.md` | Pracuję z logo, brandingiem, obrazami |
| `POLISH_NAMING.md` | Nazewnictwo pól JSON / Keystatic |

### QA i deploy
| Plik | Kiedy czytać |
|------|-------------|
| `QA-RUNBOOK.md` | Testowanie, gate QA, przed mergem |
| `DEPLOY_WORKFLOW.md` | Deploy FTP / Turbo ZIP |
| `studio/smoke-checklist.md` | Sprawdzenie Studio |
| `KNOWN_ISSUES.md` | Debuguję problem: brak CSS/stylów na produkcji, znikające animacje, toolbar nie działa. Lista znanych bugów z diagnozą krok po kroku |

### Prototypowanie UI
| Plik | Kiedy czytać |
|------|-------------|
| `VERSION_TOOLBAR.md` | Robię warianty sekcji do porównania (toolbar `?vt=1`, atrybuty `data-version-*`, workflow i czyszczenie) |

### Planowanie
| Plik | Kiedy czytać |
|------|-------------|
| `ROADMAP.md` | Co jest planowane |
| `plans/*.md` | Szczegóły planowanych feature'ów |

---

## Szybki start (tworzenie strony klienta)

1. Klient podaje wymagania (sekcje, treść, vibe)
2. Dobierz sekcje z `section-registry.ts` (hinty w opisie każdej sekcji)
3. Utwórz `src/data/pages/[slug].json` z kolejką sekcji
4. Uzupełnij `src/data/sections/*.json` (treści, nie strukturę)
5. Jeśli brak bloku → nowy Registry Block w `src/components/registry/` → rejestracja (reguła 5)
6. `npm run build` → weryfikacja

### Format `src/data/pages/[slug].json`

```json
{
  "seo": { "title": "...", "description": "..." },
  "heading": "Główny tytuł strony",
  "sections": [{ "id": "hero", "variant": "default" }]
}
```

**`heading` (wymagane):** tytuł h1 strony. PageBuilder przekazuje go do hero jako `pageHeading` (h1 = heading z page config, nie marketingowy `title` z danych sekcji). Walidacja: `npm run check:page-registry`.
