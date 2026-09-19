# Starter Kit QA Tasks

## Cel

Ta checklista jest operacyjnym planem wdrożenia wniosków z [Audyt-klientów.md](./Audyt-klientów.md). Każde zadanie ma status aktualizowany po implementacji i weryfikacji.

Statusy:

- `[x]` wykonane i zweryfikowane
- `[~]` częściowo wykonane albo oczekuje na ręczną weryfikację
- `[ ]` do wykonania

## Stan bieżący

Ostatnia aktualizacja: 2026-07-21

Branch: `master`

Ostatni commit: `724fd9c`

Wyniki:

- `npm run check:mobile`: 0 nowych naruszeń, kod 0
- `npm run check:mobile -- --strict`: znane naruszenia traktowane jako błędy, kod 1
- `npm run check:content`: wykrywa świadome placeholdery startera, kod 1
- `npm run check:links`: 0 naruszeń, 102 pliki, kod 0
- `npm run build:prod`: prawidłowo blokuje się na placeholderach, kod 1
- `npm run test:mobile`: 26/26
- `npm run test`: 315/315 (24 pliki testowe)
- `npm run build`: 7 stron, kod 0 (Astro 7.0.9)
- `npm run qa`: 5/5 kroków, kod 0
- `npm run qa:client`: blokada na placeholderach startera, kod 1, oczekiwane dla starter kita

## P0. Konieczne

### Mobile QA i fixture

- [x] Utworzyć stronę `/qa/mobile-fixture/` z navbar, drawerem, hero, kartami, marquee, formularzem, anchorem, obrazem i footerem.
- [x] Dodać ekstremalne dane testowe: długie emaile, telefony, adresy, nagłówki i pojedyncze długie słowa.
- [x] Rozszerzyć `check-mobile-layout.ts` na atomy, layouty, navbar, drawer, footer, CookieConsent i bloki registry.
- [x] Dodać reguły dla fixed width, `w-screen`, `whitespace-nowrap`, `min-w-0`, touch targetów, obrazów, ARIA, `href="#"` i hover-only interactions.
- [x] Dodać testy jednostkowe reguł audytu mobile, 26 testów przechodzi.
- [x] Dodać `.audit-baseline.json` z precyzyjnym dopasowaniem `file + rule + line`.
- [x] Dodać `generate-baseline.ts` do automatycznej regeneracji wpisów baseline.
- [x] Dodać osobny test regresyjny potwierdzający, że nowe naruszenie w tej samej regule i pliku, ale w innej linii, nie jest `KNOWN`.
- [~] Ręcznie sprawdzić focus trap draweru przez Tab i Shift+Tab.

### Karty i overflow

- [x] Dodać `min-w-0` do `Card.astro`.
- [x] Dodać `break-words` i `min-w-0` do `CardContent.astro`.
- [x] Potwierdzić brak overflow fixture przy szerokościach 320, 375, 390 i 414 px.
- [~] Zweryfikować ręcznie warianty kart registry z długimi danymi.

### Navbar, drawer i anchory

- [x] Dodać `aria-expanded` do `MenuToggle.astro`.
- [x] Dodać focus trap, Escape, przywracanie focusu i aktualizację ARIA w `navbar.js`.
- [x] Dodać obsługę anchorów i offsetu nagłówka w `lenis.js`.
- [x] Odtwarzać instancję Lenis po `astro:after-swap`.
- [x] Potwierdzić działanie `#contact` na fixture.
- [~] Ręcznie sprawdzić Lenis po przejściu między stronami przez Astro navigation.

### Dane placeholderowe

- [x] Dodać `npm run check:content` blokujące produkcyjny build przy placeholderach.
- [x] Objąć walidacją `example.com`, `twojastrona.pl`, przykładowe telefony, adresy, `#` w social media, `Nazwa strony`, `Twoja Firma`, `Krótki opis`, `@` w twitterHandle i słowo `placeholder` w wartościach.
- [x] Rozdzielić dane QA fixture od danych produkcyjnych i dodać test, że fixture nie importuje globalnej konfiguracji ani `company.json`.
- [x] 30 testów jednostkowych dla każdego typu placeholdera.
- [x] Placeholdery wykrywane w istniejących danych startera.

### Polskie znaki w treściach

- [x] Dodać regułę `polish-diacritics` do `check:content` dla danych globalnych, nawigacji, sekcji, stron i template'ów.
- [x] Wykrywać typowe polskie słowa zapisane ASCII, między innymi `uslugi`, `rozwiazania`, `wiadomosc`, `sprawdz` i `wdrozeniu`.
- [x] Dodać testy Vitest dla błędnej treści polskiej, poprawnej treści polskiej oraz treści angielskiej.
- [x] Podmienić wykryte błędy w danych starter kita przed użyciem go jako gotowej strony klienta.

### Linki

- [x] Dodać `npm run check:links`.
- [x] Sprawdzać lokalne routy, anchory, linki CTA, stopkę, linki językowe, zewnętrzne URL i `href="#"`.
- [x] Dodać test linków do stron z trailing slash (36 testów).
- [x] Naprawiono `href="#"` w `FaqListBlock.astro` (moreLink -> pusty, CTA -> /kontakt/) i `hero-centered.json` (primaryCTA -> /contact/).
- [x] `check:links` nie wykrywa już naruszeń, kod 0.

### Wspólny system scrollowania

- [x] Wyciągnąć anchor scroll, reset scrolla, Astro navigation, Lenis, offset nagłówka i reduced motion do jednego stabilnego kontraktu.
- [x] Dodać test zachowania po `astro:after-swap`.
- [x] Dodać test dla linku do innej strony z hashem.

## P1. Bardzo ważne

- [x] Dodać testy kontraktowe Button i Card (w tym CardHeader, CardTitle, CardDescription, CardContent, CardFooter).
  - Pliki: `src/components/ui/atoms/button-contract.test.ts` (27 testów), `src/components/ui/atoms/card/card-contract.test.ts` (21 testów).
  - Testują wynik renderowania HTML: tag, klasy, atrybuty, sloty, warianty, rozmiary, disabled, accessibility, długi tekst i overflow.
- [x] Dodać testy kontraktowe Navbar — MenuToggle, MobileDrawer, NavbarMainCentered (34 testy).
  - Plik: `src/components/ui/molecules/Navbar/navbar-contract.test.ts` (34 testów).
  - Testują: aria-expanded, aria-controls, focusable elements, trailing slash, CTA, mobile-first klasy, touch targety, brak pustych href.
- [x] Dodać testy kontraktowe Section (11 testów) i Grid (16 testów).
  - Pliki: `src/components/ui/layout/section-contract.test.ts`, `src/components/ui/layout/grid-contract.test.ts`, `src/components/registry/hero-contract.test.ts` (53 testy łącznie).
  - Section: element, id, data-auto-reveal, tone, children, custom class, brak href="#".
  - Grid: kolumny (default, md, lg), gap, children, role, custom class, długie dane.
- [~] Dodać kontrakt Hero na podstawie struktury fixture QA (26 testów). W projekcie nie ma dedykowanego komponentu Hero, więc test nie zabezpiecza API konkretnego komponentu.
  - Plik: `src/components/registry/hero-contract.test.ts`.
  - Testuje: jeden h1, heading hierarchy, tagline, description, CTA z trailing slash, obraz z alt/width/height/aspect-ratio, długi tekst, mobile-first klasy, brak href="#".
- [~] Przenieść testy z implementacji na wynik renderowania, dane i zachowanie (częściowo: Button, Card, Navbar, Section, Grid, Hero przez cheerio, bez importu .astro).
- [x] Dodać page registry validator dla sectionId, dataKey, h1, tras i kompletności wariantów.
- [x] Dodać walidację obrazów: alt, width, height, loading, proporcje i fallback.
- [x] Ujednolicić reduced motion oraz potwierdzić widoczność treści bez JavaScript.
- [x] Usunąć albo formalnie zastąpić martwą konfigurację `src/config/site.ts`.

## P2. Proces

- [x] Utworzyć tę checklistę w repozytorium starter kita.
- [x] Dodać script `npm run check:baseline-update` wskazywany przez generator baseline.
- [x] Dodać `.docs/QA-RUNBOOK.md` dla projektów klientów.
- [x] Dodać jedną końcową komendę `qa:client`.
- [x] Ustalić obowiązkową macierz wizualnej weryfikacji w `.docs/MOBILE-VISUAL-MATRIX.md`: 320, 375, 390, 414, 768, 834, 1024, 1280, 1366, 1440 i 1920 px.

## Następne zadanie

Ręczna weryfikacja focus trap draweru przez Tab i Shift+Tab oraz Lenis po `astro:after-swap` — kod jest gotowy i sprawdzony statycznie, ale wymaga testów w przeglądarce. Do rozważenia: kontraktowe testy Footer i Contact.

## Historia aktualizacji

- 2026-07-18: uproszczono cykl życia Lenis do jednej instancji, dodano bezpieczne rozróżnienie anchorów tej samej strony i nawigacji między stronami, obsługę reduced motion oraz test kontraktu `src/utils/lenis-contract.test.ts`.
- 2026-07-18: dodano `npm run check:page-registry` oraz testy walidujące page config, sekcje, warianty, dane, komponenty, navbar, footer i źródło pojedynczego h1.
- 2026-07-18: dodano `npm run check:images` dla rendered HTML oraz kontrakt fallbacku `SmartImage`; podłączono oba audyty do profili `qa` i `qa:strict`.
- 2026-07-18: zastąpiono martwy `src/config/site.ts` minimalnym `src/config/template.ts`; reveal jest widoczny bez JavaScript, a reduced motion ma jawny kontrakt testowy.
- 2026-07-18: dodano obowiązkową macierz wizualnej weryfikacji dla 11 szerokości viewportu.
- 2026-07-21: poprawiono polskie znaki diakrytyczne we wszystkich plikach danych (company.json, seo.json, header.json, footer.json, faq.json, testimonials.json, hero-centered.json). check:content wykrywa już tylko oczekiwane placeholdery i fałszywie pozytywne sygnatury ASCII w URL/neutralnych słowach. Liczba testów: 315/315 (24 pliki). check:links: 102 pliki, 0 naruszeń.

- 2026-07-15: dodano fixture mobile, audyt statyczny, poprawki kart, draweru, navbaru i Lenis.
- 2026-07-15: dodano poprawki CookieConsent, false positive marquee i zależność `fast-glob`.
- 2026-07-15: dodano baseline legacy z rozróżnieniem nowych naruszeń.
- 2026-07-16: zawężono baseline do `file + rule + line` i rozpoczęto tę checklistę.
- 2026-07-16: dodano test regresyjny dopasowania baseline oraz `npm run check:baseline-update`.
- 2026-07-16: dodano `npm run check:content`, `src/utils/content-audit.ts`, `src/utils/content-audit.test.ts` i `src/scripts/check-content.ts`. Wykrywało 17 placeholderów w istniejących danych produkcyjnych. Fixture QA jest wyłączony z audytu.
- 2026-07-16: dodano `npm run check:links`, `src/utils/link-audit.ts`, `src/utils/link-audit.test.ts` i `src/scripts/check-links.ts`. 36 testów.
- 2026-07-16: naprawiono 2 puste linki w `FaqListBlock.astro` i `hero-centered.json`. `check:links` przechodzi bez naruszeń, 91 plików.
- 2026-07-16: podłączono `check:content` jako bramkę `build:prod`. Build produkcyjny zatrzymuje się na placeholderach, a zwykły build nadal przechodzi.
- 2026-07-16: dodano testy kontraktowe Button (27 testów) i Card (21 testów) przez cheerio.
- 2026-07-16: dodano testy kontraktowe Navbar (34 testy) — MenuToggle, MobileDrawer, NavbarMainCentered.
- 2026-07-16: dodano testy kontraktowe Section (11), Grid (16) i Hero (26). Uwaga: w projekcie nie ma dedykowanych komponentów Hero w registry — test oparto o strukturalny kontrakt z fixture QA. npm run qa: 20 plików, 277 testów, zielone.
- 2026-07-16: zweryfikowano batch Section, Grid i Hero przez `npm run qa`. Standardowy gate przechodzi 5/5 kroków, a cały zestaw obejmuje 277 testów w 20 plikach. Kontrakt Hero pozostaje częściowy, ponieważ nie istnieje dedykowany komponent Hero.
- 2026-07-16: zweryfikowano batch Navbar przez `npm run qa`. Standardowy gate przechodzi 5/5 kroków, a cały zestaw testów obejmuje 224 testy w 17 plikach.
- 2026-07-16: aktualizacja Astro 6.1.5 → 7.0.9. Zmiany: `@astrojs/react` 5→6, `@astrojs/sitemap` 3.7.2→3.7.3, `@tailwindcss/vite` 4.3.0→4.3.2. Fix Rust compiler: usunięto HTML comments w Layout.astro i domknięto `<span set:html>` w SectionHeader.astro. Wszystkie testy i checki przechodzą. 7 stron, sitemap działa.
- 2026-07-16: dodano orchestrator `run-qa.ts`, profile `qa`, `qa:strict`, `qa:client`, `qa:help`, dokumentację `.docs/QA-RUNBOOK.md` i instrukcje QA dla AI w `AGENTS.md`. Standardowy profil QA przechodzi 5/5 kroków.
