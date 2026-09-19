---
title: Audyt Techniczny Strony
tags: [audit, seo, crawler, quality-assurance]
type: concept
date: 2026-07-30
---

# Audyt Techniczny Strony

## Co to jest?

Mini crawler i audyt techniczny + pełna ekstrakcja tekstu. Crawluje wszystkie wewnętrzne linki (odkrywając strony przez linkowanie), sprawdza status HTTP, analizuje SEO, język i jakość treści.

## Jak uruchomić?

```bash
npm run audit:site
```

**Wymagania:**
- Dev server musi być uruchomiony (`npm run dev`)
- Domyślny port: `http://localhost:4321` (zmiana w `index.ts`)

## Struktura kodu

```
src/scripts/audit/
├── index.ts        # Entry point — uruchamia cały pipeline
├── crawler.ts      # Pobiera strony, ekstrahuje linki i tekst
├── analyzer.ts     # Analiza: placeholder-y, polskie znaki, język
├── reporter.ts     # Generuje 3 pliki wyjściowe
└── types.ts        # Wspólne typy (PageData, AuditReport, itp.)
```

## Co sprawdza?

### 1. Status HTTP
- ✅ 200 - OK
- ⚠️ 3xx - Przekierowanie
- ❌ 404 - Strona nie znaleziona
- ❌ 500 - Błąd serwera

### 2. SEO
- **Title** — czy istnieje, długość (10-60 znaków)
- **Meta description** — czy istnieje, długość (50-160 znaków)
- **H1** — czy jest dokładnie jeden
- **Zdjęcia** — czy mają alt text

### 3. Treść
- **Ilość słów** — zalecane min. 150 na stronie
- **Puste strony** — mniej niż 50 słów
- **Duplikaty tytułów** — te same title na różnych stronach
- **Duplikaty meta descriptions** — te same opisy

### 4. Język (polski)
- **Brak polskich znaków** — wykrywa słowa bez ą, ć, ę, ł, ń, ó, ś, ź, ż
- **Placeholder-y** — Lorem ipsum, "Treść do uzupełnienia", TODO, testowe dane
- **Podwójne spacje** — 3+ białe znaki z rzędu
- **Tekst Caps Lockiem** — zdania pisane samymi wielkimi literami

### 5. Techniczne
- **Czas ładowania** — ile ms zajmuje załadowanie strony
- **Linki wewnętrzne** — czy nie prowadzą do 404
- **Nawigacja** — czy wszystkie podstrony są osiągalne

## Wyjścia (3 pliki)

Po uruchomieniu `npm run audit:site` w `audit-reports/` pojawiają się 3 pliki:

```
audit-reports/
├── audit-YYYY-MM-DDTHH-MM-SS.json    # Dane surowe (pełny JSON)
├── audit-YYYY-MM-DDTHH-MM-SS.md      # Raport techniczny (podsumowanie + problemy)
└── text-dump-YYYY-MM-DDTHH-MM-SS.md  # PEŁNY TEKST ze wszystkich stron
```

### 📄 audit-*.json — dane surowe
Pełne dane z analizą każdej strony (title, meta, h1, bodyText, links, images, issues, itp.). Przeznaczone do dalszej automatycznej obróbki.

### 📄 audit-*.md — raport techniczny
Czytelne podsumowanie:
- Ile stron OK / ostrzeżenia / błędy
- Lista uszkodzonych linków
- Wykryte placeholder-y
- Problemy językowe (polskie znaki)
- Duplikaty tytułów/meta
- Brakujące H1, alt texty
- Tabela wszystkich stron

### 📄 text-dump-*.md — pełny tekst (KLUCZOWY)
**To jest główny plik do przeglądania treści.** Zawiera:
- Spis treści z liczbą słów
- Dla każdej strony: tytuł, meta, H1, pełny tekst pogrupowany wg sekcji (h2)
- **Nie jest obcięty** — pełna treść, nie 5000 znaków

Otwórz ten plik w edytorze i przejrzyj pod kątem:
- Błędów ortograficznych i interpunkcyjnych
- Placeholderów
- Spójności treści między stronami
- Polskich znaków diakrytycznych

## Konfiguracja

### Zmiana URL
W `src/scripts/audit/index.ts`:
```typescript
const BASE_URL = 'http://localhost:4321';
```

### Zmiana limitu stron
W `src/scripts/audit/crawler.ts` (default config):
```typescript
maxPages: 50,
```
Lub przekaż w `index.ts`:
```typescript
const { pages } = await crawlSite({ baseUrl: BASE_URL, maxPages: 100 });
```

### Pomijanie ścieżek
W `crawler.ts`:
```typescript
skipPatterns: ['/dev/', '/qa/', '/studio', '/_astro/'],
```

## Jak działa crawler?

1. **Start z `/`** — pobiera stronę główną
2. **Ekstrahuje linki** — znajduje wszystkie `a[href]` (wewnętrzne)
3. **Odkrywa strony** — dodaje nowe linki do kolejki (FIFO)
4. **Kontynuuje** dopóki nie odwiedzi wszystkich lub nie osiągnie limitu
5. **Analizuje** każdą stronę (SEO, język, placeholder-y)
6. **Generuje raporty** — 3 pliki w `audit-reports/`

Strony NIE są wpisywane na sztywno — crawler sam je odkrywa przez linkowanie. Jeśli strona nie jest linkowana z żadnej innej strony, crawler jej nie znajdzie (co jest prawidłowym zachowaniem — to problem SEO).

## Dla następnego agenta

### Szybki start
```bash
# 1. Upewnij się, że dev server działa
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/

# 2. Uruchom audyt
npm run audit:site

# 3. Sprawdź raport techniczny
# Otwórz najnowszy plik audit-*.md w audit-reports/

# 4. Przejrzyj pełny tekst
# Otwórz najnowszy text-dump-*.md w audit-reports/
```

### Priorytety napraw
1. **❌ Błędy (404, 500)** — natychmiast
2. **🏷️ Placeholdery** — usunąć placeholder-y, wstawić prawdziwą treść
3. **🇵🇱 Brak polskich znaków** — poprawić diakrytykę
4. **⚠️ Brak title/meta** — SEO
5. **⚠️ Za mało tekstu** — minimum 150 słów
6. **⚠️ Brak H1** — struktura
7. **⚠️ Zdjęcia bez alt** — dostępność

### Gdzie szukać problemów?
- **Treść stron:** `src/data/pages/*.json`
- **Komponenty:** `src/components/`
- **Szablony stron:** `src/pages/`

## Wykrywane placeholder-y

| Wzorzec | Etykieta |
|---------|----------|
| lorem ipsum | Lorem ipsum |
| treść do uzupełnienia | Treść do uzupełnienia |
| tekst tymczasowy | Tekst tymczasowy |
| tutaj wpisz... | Tutaj wpisz... |
| placeholder | placeholder |
| sample text | Sample text |
| TODO / FIXME | TODO / FIXME |
| test@test.com | E-mail testowy |

Pełna lista w `analyzer.ts` (tablica `PLACEHOLDER_PATTERNS`).

## Wykrywane brakujące polskie znaki

Słowa sprawdzane automatycznie: działalność, jakość, jakość, usługa, usługi, ważne, najważniejsze, i in.

Pełna mapa w `analyzer.ts` (słownik `POLISH_WORDS`).

## Troubleshooting

### "Nie udało się połączyć z serwerem"
Upewnij się, że `npm run dev` działa i sprawdź port w `index.ts`.

### "Zbyt wolne działanie"
Zmniejsz `maxPages` lub zwiększ `requestDelay` w configu crawlera.

### Strona nie jest crawlowana
Jeśli strona nie jest linkowana z żadnej innej strony, crawler jej nie odkryje. Dodaj ją ręcznie do `toVisit` w `crawler.ts` lub sprawdź nawigację.
