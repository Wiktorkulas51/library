# Headery i stopki

Jedno miejsce, w którym są opisane wszystkie warianty menu i stopek w bibliotece oraz wzorce zachowania przy scrollu. Przed pisaniem nowego headera dla klienta sprawdź tę listę i weź gotowy wariant.

Podgląd każdego wariantu: `/components/<id>/<wariant>/`, np. `/components/alanHeader/default/`. W katalogu na `/` grupy „Menu” i „Footer”.

## Ulubione (pierwszy wybór)

| Id w rejestrze | Typ | Skąd | Charakter |
|---|---|---|---|
| `webscaleNavbar` | menu | WebScale | Pasek fixed, przezroczysty, po 20 px białe szkło z blur. Mega dropdowny na wspólnej, animowanej scenie, wskaźnik hover jako pigułka, przyciemnienie strony pod otwartym menu, pełnoekranowe menu mobilne. |
| `webscaleFooter` | stopka | WebScale | Logo, opis i sociale, 4 kolumny linków, ogromny rozmyty znak słowny w tle (desktop). |
| `alanHeader` | menu | Alan Zbel | Pasek fixed na pełną szerokość, który przy scrollu płynnie zwęża się do 64rem i dostaje zaokrąglone tło, logo się zmniejsza. Drawer mobilny z warstwami. |
| `alanFooter` | stopka | Alan Zbel | Ciemna stopka: logo, opis, sociale ze strzałkami, numerowane linki 01 do 04, pasek prawny i „Wróć na górę”. |
| `formaNavbar` | menu | Forma (T002) | Sticky pigułka na jasnym tle, przy scrollu zwęża się, podnosi i dostaje cień. Mobilnie rozwijany panel pod paskiem. |
| `formaFooter` | stopka | Forma (T002) | Ciemny grafit, duże zdanie i podkreślone CTA ze strzałką, odwrócony znak słowny, linki i kredyt. |
| `navbar` / `floating` | menu | Nova (T001), Starter Kit | Wzorzec static→fixed, opisany niżej. Nova używa go z własnym motywem kolorów. |
| `novaFooter` | stopka | Nova (T001) | Zdjęcie z przyciemnieniem, duży nagłówek, dwa przyciski, linki prawne i nawigacja, pasek z kredytem. |

Uwagi do podglądu w katalogu:
- `alanHeader` jest projektowany na ciemną stronę. Na jasnym tle podglądu jego linki są słabo widoczne.
- `formaNavbar` jest `position: sticky`, więc musi być bezpośrednim dzieckiem wysokiego kontenera strony (np. `body` albo głównego wrappera). W krótkim kadrze podglądu odjeżdża razem z nim.
- Podgląd `navbar/floating` nie ładuje `public/js/navbar.js`, więc pasek fixed nie wjeżdża w katalogu. Na stronie z `Layout` Starter Kita działa.

## Pozostałe warianty

| Id | Typ | Charakter |
|---|---|---|
| `navbar` / `centered`, `plain`, `local` | menu | Klasyczne układy Starter Kita: logo, linki na środku, CTA. `local` z paskiem kontaktowym. |
| `navbarContact` | menu | Pasek kontaktowy z telefonem i sticky header (Marek Jodłowski). |
| `lcNavbar`, `lcSubnav` | menu | Szklany pasek nad hero i sticky subnawigacja (Lean Creative). |
| `navbarTrainer` | menu | Zaokrąglona szklana pigułka, zawsze fixed, kompaktowa po 50 px (Kasia). |
| `piekary9Navbar` | menu | Zawsze fixed, klasyczny (Piekary). |
| `footer` / `columns`, `minimal`, `promo` | stopka | Klasyczne stopki Starter Kita. |
| `footerContact`, `footerTrainer`, `piekary9ContactDetails` | stopka | Stopki klientów: panel kontaktowy, fitness z lokalizacjami, dane kontaktowe. |

Każdy blok klienta trzyma kolory jako zmienne CSS na swoim korzeniu (np. `--wsb-primary`, `--color-brand-primary` w `.forma-navbar`). Żeby dopasować wariant do nowego klienta, nadpisz te zmienne i podmień JSON w `src/data/sections/<dataKey>.json`. Znaczników nie przepisuj.

## Wzorzec static→fixed z animacją (raz spisany)

Header leży w hero jak zwykły element strony, a po przewinięciu poza hero wjeżdża od góry jako pasek fixed. Używany u kilku klientów (Nova, Anna Grygiel, Annawie, Michał Staczkun, Modern House). Nie pisz go od nowa, użyj layoutu `floating`.

Pliki:
- `src/components/ui/molecules/Navbar/layouts/Floating.astro`, znaczniki i CSS.
- `public/js/navbar.js`, przełączanie klas i drawer mobilny.

Jak działa:
1. Dwa headery. Pierwszy `data-site-header data-site-header-static` jest `absolute` nad hero i przewija się razem ze stroną. Drugi `data-site-header-fixed` jest `fixed`, schowany przez `-translate-y-full opacity-0` i `aria-hidden="true"`.
2. `navbar.js` w `requestAnimationFrame` sprawdza `pageYOffset`. Po przekroczeniu progu dodaje klasę `is-visible` do paska fixed (oraz `is-scrolled` do statycznego) i ustawia `aria-hidden="false"`.
3. CSS animuje `translate` 0.35s `cubic-bezier(0.22, 1, 0.36, 1)` i `opacity` 0.35s. Przy `prefers-reduced-motion` pasek pojawia się bez ruchu.
4. Nie ma skoku układu, bo oba headery są poza przepływem. `ResizeObserver` zapisuje wysokość statycznego headera do `--site-header-height`, a `<main>` dostaje z niej `padding-top`, chyba że strona ma `fullBleedTop`.

Ustawienia:
- Próg: domyślnie 300 px, czyli po zjechaniu z większości hero. Inny próg ustawisz atrybutem `data-scroll-threshold="120"` na statycznym headerze.
- Motyw: `navbarTheme="transparent" | "light" | "dark"` w `Layout`.

Własny header klienta ze static→fixed: zachowaj te same atrybuty (`data-site-header-static`, `data-site-header-fixed`) i reguły CSS z `Floating.astro`, a `navbar.js` zadziała bez zmian.

## Wzorzec płynnej zmiany kształtu przy scrollu

Druga rodzina: jeden header, który nie przełącza `position`, tylko płynnie zmienia szerokość, promień, cień i tło (Alan Zbel, Forma).

- Skrypt: `public/js/header-scroll-progress.js`. Header oznacz `data-header-progress` i opcjonalnie `data-header-progress-distance="220"`.
- Skrypt zapisuje na headerze `--nav-scroll-progress` od 0 do 1, wygładzane wykładniczo (115 ms). Przy reduced motion wartość idzie od razu do celu.
- Wygląd liczy CSS bloku, np. `width: calc(var(--full) - var(--nav-scroll-progress) * (var(--full) - var(--compact)))`.
- Animuj tylko tanie właściwości. Tło i cień trzymaj na warstwie `::before` i zmieniaj jej `opacity`. Nie animuj `backdrop-filter`, bo przerysowuje całe tło pod paskiem.

## Dodanie nowego wariantu

1. Blok w `src/components/registry/<źródło>/<Nazwa>Block.astro`, dane w `src/data/sections/<dataKey>.json`, CSS zawężony do klasy korzenia bloku.
2. Wpis w `src/config/component-manifest.ts` (alfabetycznie).
3. Wpis w `src/config/section-registry/shell.ts` z `groupId: 'navbar'` albo `'footer'` i w `SECTION_REGISTRY` w `src/config/section-registry.ts`.
4. Nowe źródło: `StudioSource` w `src/config/section-registry/types.ts` i etykieta w `DEVELOPER_SOURCE_LABELS`.
5. Test kontraktu `src/components/registry/<nazwa>-contract.test.ts` i wiersz w tabeli powyżej.
