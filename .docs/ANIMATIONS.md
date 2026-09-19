# Standard animacji Starter Kita

Status: obowiązujący standard dla nowych bloków i zmian w istniejących komponentach.
Audyt implementacji: 2026-08-11.

## Cel

Ruch ma wspierać hierarchię treści, orientację i informację zwrotną. Nie może
opóźniać dostępu do treści, utrudniać interakcji ani tworzyć wrażenia
przypadkowego ruchu.

Ten plik jest źródłem prawdy dla animacji. Reguły w `AI_STANDARDS.md`,
`AI_GUIDE.md` i `DESIGN_RULES.md` muszą być z nim zgodne.

## Wynik audytu obecnego stanu

### Faktyczne punkty wejścia

- Nie istnieją pliki `animations.js` ani `site-scroll`. Opis zadania został
  zaktualizowany do faktycznych nazw w repozytorium.
- Globalny reveal działa przez `public/js/motion.js` oraz
  `src/styles/motion.css`.
- `Section.astro` dodaje `data-motion-section`, więc zwykłe sekcje dostają
  auto reveal bez ręcznego markup'u.
- `Layout.astro` ładuje `ClientRouter`, `motion.js` oraz opcjonalny `lenis.js`.
- Natywne płynne przewijanie jest zdefiniowane w `src/styles/foundations.css` i działa
  tylko przy `prefers-reduced-motion: no-preference`.
- `public/js/lenis.js` obsługuje jedną instancję Lenis, kotwice, zmianę strony
  Astro oraz elementy z `data-lenis-prevent`.

### Używane mechanizmy

| Mechanizm | Implementacja | Decyzja |
| --- | --- | --- |
| Globalny reveal | `motion.js`, `motion.css`, `data-motion-section` | Zostaje jako domyślny reveal |
| Jawny reveal | `data-motion="fade"` i sekwencje `fade` lub `viewport` | Zostaje jako wyjątek dla kompozycji wymagających kontroli |
| Smooth scroll | Natywny `scroll-behavior` oraz opcjonalny Lenis | Zostaje, Lenis tylko po świadomym włączeniu |
| Marquee | `ui-marquee`, `ui-marquee-ltr`, `ui-marquee-rtl`, `ui-wall` | Zostaje warunkowo dla powtarzalnych treści |
| Ken Burns | `ui-ken-burns` i lokalny `hero-zoom` | Zostaje tylko dla aktywnego obrazu |
| Dekoracje | `EditorialBlobs`, `FloatingShapes`, `SparkleDots`, cząstki | Zostają warunkowo, nigdy jako obowiązkowy styl |
| Stany funkcjonalne | FAQ, toast, filtr, formularz, timeline | Zostają, jeśli wyjaśniają zmianę stanu |
| Przejścia stron | `ClientRouter`, bez animacji głównego `main` | Zostaje natychmiastowa zmiana strony |

### Pozostałości historyczne

- Klasy `auto-reveal-item`, `reveal-group` oraz `data-reveal` nie mają już
  aktywnego globalnego runtime i nie występują w kodzie produkcyjnym. Skrypt
  `check:motion` pilnuje, aby nie wróciły do komponentów.
- `transition:animate="none"` na navbarze i footerze jest jawnym wyłączeniem
  animacji tych elementów przy View Transitions. Nie jest osobnym efektem.
- Lokalna animacja może pozostać wyłącznie wtedy, gdy opisuje funkcjonalny lub
  medialny wyjątek, na przykład Ken Burns, marquee albo zmianę stanu formularza.
  Animacje wejścia treści migrujemy do globalnego motion.

## Parametry standardu

### Globalny reveal

Globalny reveal jest jedynym domyślnym mechanizmem wejścia sekcji.

- czas: `1000ms`,
- easing: `cubic-bezier(0.16, 1, 0.3, 1)`,
- stagger: `120ms`,
- blur: `5px`,
- dystans: `0.75rem`,
- media dostają fade bez blura przez `data-motion-media`,
- elementy pierwszego viewportu nie mogą być chowane przed LCP,
- brak JavaScriptu nie może powodować ukrycia treści.

Nie dodawaj jawnych atrybutów motion do zwykłej sekcji, jeśli działa auto
reveal. `data-motion="fade"` i sekwencje są zarezerwowane dla uzasadnionych
wyjątków.

### Hover i focus

Nowe interakcje używają CSS `transition`, bez kolejki reveal i bez opóźnienia
reakcji na kliknięcie lub focus.

| Rodzaj zmiany | Czas docelowy | Easing |
| --- | --- | --- |
| Kolor, opacity, border | `150-200ms` | `ease-out` lub standardowy motion ease |
| Transformacja elementu | `250-300ms` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Obraz lub większa powierzchnia | `400-600ms` | `cubic-bezier(0.16, 1, 0.3, 1)` |

Hover nie może zmieniać układu w sposób powodujący skok, blokować focusu ani
zależeć wyłącznie od urządzenia z myszą.

### Smooth scroll i kotwice

- Natywny `scroll-behavior: smooth` pozostaje bezpiecznym fallbackiem.
- Lenis jest mechanizmem opcjonalnym. Włączaj go tylko wtedy, gdy dana strona
  potrzebuje kontrolowanego smooth scrolla lub obsługi kotwic przez Lenis.
- Przy `prefers-reduced-motion: reduce` Lenis nie tworzy instancji, a kotwice
  działają natywnie.
- Lenis musi mieć jedną instancję, zatrzymywać pętlę przed `astro:before-swap`
  i odtwarzać stan po `astro:after-swap`.
- `data-lenis-prevent` stosuj dla pól tekstowych, paneli i elementów z własnym
  przewijaniem.
- Po przejściu między stronami reset scrolla jest natychmiastowy.

### Marquee i wall scroll

Marquee jest dozwolony wyłącznie dla powtarzalnych treści, które mają drugą
kopię zapewniającą płynną pętlę.

- easing: `linear`,
- typowy czas: `28s` na mobile oraz `36-46s` na desktopie,
- pauza na `hover` i `focus-within`, gdy użytkownik może chcieć przeczytać
  element,
- treść musi mieć sens także po zatrzymaniu ruchu,
- reduced motion wyłącza ruch i pokazuje stabilny stan.

### Ken Burns

Ken Burns jest dozwolony tylko na obrazie aktywnego hero lub galerii. Nie może
poruszać treści, przycisków ani elementów interaktywnych.

- czas: około `6s`,
- easing: `ease-out`,
- transformacja: wyłącznie delikatny scale, maksymalnie około `1.06-1.08`,
- reduced motion: stan statyczny bez animacji.

### Dekoracje

Ruch dekoracyjny jest wyjątkiem konkretnego bloku, nie globalnym tłem całej
strony. Dekoracja musi mieć `pointer-events: none`, nie może wpływać na layout
i musi zatrzymywać się przy reduced motion.

Dozwolone są powolne drifty `5.5-12s` z `ease-in-out`, particle drift w sekcji
multimedialnej oraz statyczne alternatywy. Zakazane są domyślne migające kropki,
pulsowanie akcentów i dekoracja, która konkuruje z treścią.

### Stany funkcjonalne

Otwieranie FAQ, filtr, toast, wynik formularza i aktywny punkt osi czasu mogą
mieć krótką animację `150-400ms`. Animacja ma wyjaśniać zmianę stanu, a nie
dekorować bez powodu. Po reduced motion stan ma zmienić się natychmiast.

### Drawer mobilny (wyjątek kompozytowy, 2026-08-28)

Pełnoekranowe menu mobilne dostaje jeden złożony efekt wejścia zamiast kilku
osobnych animacji przypadkowo zsynchronizowanych:

- mechanizm: wyłącznie CSS `transition` (bez GSAP); JS tylko przełącza klasy
  `is-open` (drawer) i `is-open` na hamburgerze oraz servisuie accordion,
- luki: backdrop fade + blur `~240ms`, kurzyny `~460ms` nieprzezroczyste
  (arkusz przezroczysty, ciemność dostarczają same kurzyny) i wjeżdżające
  z prawej ze staggerem `~90ms` każda, linki wznoszące się `~460ms`
  z bazowym opóźnieniem `300ms` (zanim kurzyny się domkną) i staggerem
  `45ms` (zmienna `--stagger` z `MobileDrawer`), CTA i social opóźnione
  względem linków,
- pokrycie ekranu: root draweru ma `width: 100vw`, żeby przy desktopie
  zakryć też pasek przewijania (inset:0 samo w sobie daje clientWidth);
- zamknięcie: część zwrotna z krótkim czasem `~240ms` bez czekania (delay 0),
  `visibility` chowa drzewo po odcinku całej animacji,
- accordion podstron: `grid-template-rows: 0fr -> 1fr` (260ms) z obrotem
  chevronu, bez max-height i magicznych pikseli,
- reduced motion: wszystkie przejścia zdjęte, stan zmienia się natychmiast,
- powód wyłączenia ze standardu 150-400ms: to nie jest informacja zwrotna
  jednego kontrolera, tylko wejście całego ekranu nawigacji; kompozycja
  warstw i staggera ma strukturę (łamanie jednej osi), a nie dekorację bez
  celu. Wszystkie submotiony trzymają się parametrów z sekcji powyżej.

Odpowiedzialne pliki: `src/styles/navigation.css`, `public/js/navbar.js`,
`src/components/ui/molecules/Navbar/shared/MobileDrawer.astro`.

### Przejścia między stronami

- `ClientRouter` może podmieniać dokument bez pełnego reloadu.
- Główny `main` nie używa `transition:animate`.
- Navbar i footer mogą mieć `transition:animate="none"`, aby zachować stabilność.
- Nie animuj scrolla do góry podczas zmiany strony.
- Nowa strona i jej hero mają być od razu dostępne po `astro:page-load`.

## Lista zakazana

- Ukrywanie treści wymagające JavaScriptu bez widocznego fallbacku.
- Ukrywanie elementów pierwszego viewportu bez ochrony LCP.
- Scroll listener używany tylko do reveal. Używaj `IntersectionObserver`.
- Osobny system reveal w każdym bloku.
- Ponowne wprowadzanie `data-reveal`, `reveal-group` lub `auto-reveal-item`.
- Smooth scroll uruchamiany przy reduced motion.
- Nieskończone animacje dekoracyjne jako domyślny styl Starter Kita.
- `@keyframes` na elemencie interaktywnym, jeśli ten sam element potrzebuje
  `transition` na tej samej właściwości.
- `animation-fill-mode: both` lub `forwards` na właściwości, którą kontroluje
  również hover albo focus przez `transition`.
- Różne, przypadkowe timingi reveal w każdym bloku.
- Ruch, który blokuje kliknięcie, zmianę strony, przewijanie lub odczyt treści.
- Animowanie całego `main` przy View Transitions.

## Reduced motion

Preferencja użytkownika ma pierwszeństwo przed efektem wizualnym.

- `motion.css` natychmiast pokazuje cele reveal i wyłącza animacje oraz
  przejścia.
- `motion.js` nie ukrywa treści przy braku `IntersectionObserver`.
- `lenis.js` nie tworzy instancji Lenis przy reduced motion.
- Marquee, wall scroll, Ken Burns, particle drift i drifty dekoracyjne zostają
  zatrzymane.
- Funkcjonalność pozostaje dostępna bez animacji.

## Kontrakt dla nowych komponentów

1. Najpierw użyj auto reveal z `Section.astro`.
2. Jeśli potrzebujesz wyjątku, wybierz istniejący atrybut `data-motion`.
3. Dla hover i focus użyj `transition`, nie `@keyframes`.
4. Nie dodawaj treści ani dekoracji, które są widoczne dopiero po uruchomieniu
   JavaScriptu.
5. Dodaj reduced motion dla każdej lokalnej animacji.
6. Sprawdź, czy animacja nie zmienia pozycji elementów sąsiednich.
7. Przy lokalnym wyjątku dopisz komentarz wyjaśniający powód.
8. Przed commitem uruchom `npm run check:motion`. Hook pre-commit wykonuje tę
   kontrolę automatycznie.

## Kontrola przed zakończeniem zmian w systemie animacji

Automatycznie:

```powershell
npm run test
npm run check:atomic
npm run build
```

Ręcznie:

1. pierwszy viewport bez migotania i opóźnienia LCP,
2. przejście między dwiema podstronami,
3. anchor na tej samej stronie,
4. hover i focus w trakcie reveal,
5. `prefers-reduced-motion: reduce`,
6. szerokości 320, 375, 390, 414 i 1440 pikseli,
7. elementy z własnym przewijaniem i `data-lenis-prevent`.

## Powiązane pliki

- `public/js/motion.js`
- `src/styles/motion.css`
- `public/js/lenis.js`
- `src/layouts/Layout.astro`
- `src/components/ui/layout/Section.astro`
- `src/scripts/check-legacy-motion.ts`
- `.husky/_/pre-commit-user`
- `.docs/AI_STANDARDS.md`
- `.docs/AI_GUIDE.md`
- `DESIGN_RULES.md`
