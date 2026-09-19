# Starter Kit — QA Runbook

## Quick Start (dla agenta bez kontekstu)

```bash
# 1. Zobacz pomoc i wybierz profil
npm run qa:help

# 2. Uruchom standardowy gate (po każdej zmianie)
npm run verify

# 3. Przed mergem do mastera
npm run qa:strict

# 4. Przed oddaniem strony klientowi
npm run qa:client
```

## Profile QA

| Komenda | Kroki | Uzywaj gdy |
|---------|-------|------------|
| `npm run verify` | test + CMS + hardcoded + mobile + linki + formularz + czysty build + wynik + SEO | Po każdej zmianie |
| `npm run qa:strict` | qa z audytem mobile w trybie strict | Przed mergem do mastera |
| `npm run qa:client` | content + build:prod + SEO klienta + formularz klienta | Przed oddaniem strony klientowi |

## Co wykrywa kazdy check

- **npm run test** — testy jednostkowe, kontraktowe (Button, Card, Navbar, Section, Grid, Hero, audyty)
- **npm run test:mobile** — reguly audytu mobile (fixed-width, min-w-0, touch targety, ARIA)
- **npm run check:mobile** — audyt statyczny komponentow (0 nowych naruszen, legacy w baseline)
- **npm run check:links** — walidacja linkow (trailing slash, href="#", broken route, h1 na stronach, form action="#")
- **npm run check:content** — walidacja placeholderow produkcyjnych
- **npm run cms:check** — zgodność JSON, CMS i rejestru sekcji
- **npm run check:hardcoded** — brak copy klienta w komponentach
- **npm run check:form** — konfiguracja formularza i zabezpieczenia
- **npm run test:form** — test endpointu PHP, pomijany bez PHP
- **npm run check:seo** — kompletność SEO i bezpieczny noindex startera
- **npm run check:seo:client** — indeksowalne SEO projektu klienta
- **npm run build** — build produkcyjny (CSS, JS, sitemap, assety)
- **npm run check:build-output** — brak tras dev, odnośników do biblioteki i osieroconych plików w `dist`
- **npm run build:prod** — build + czyszczenie studia + blokada na placeholdery

Obowiązkowe szerokości do ręcznej weryfikacji są opisane w [MOBILE-VISUAL-MATRIX.md](./MOBILE-VISUAL-MATRIX.md).

## Placeholdery

Starter kit zawiera świadome placeholdery (example.com, Nazwa strony,
+48 123 456 789, Twoja Firma, social `#` itd.). Są one wykrywane przez
`check:content` i powodują oczekiwany błąd. `qa:client` zawsze zakończy
sie kodem 1, dopoki dane nie zostana zastapione prawdziwymi danymi klienta.

Audyt `check:content` wykrywa również polskie słowa zapisane bez znaków diakrytycznych,
na przykład `uslugi`, `rozwiazania`, `wiadomosc`, `sprawdz` i `wdrozeniu`. Zwykły tekst
angielski, niemiecki, URL-e i nazwy własne nie są blokowane przez tę regułę.

## Fixture QA

- Strona: `/qa/mobile-fixture/`
- Zawiera: navbar, drawer, hero, karty, marquee, formularz, obraz, footer
- Dane ekstremalne: dlugie emaile, telefony, adresy, teksty
- Sklada sie z wlasnego JSON (nie importuje `company.json` ani `siteConfig`)
- Wykluczony z `check:content`, `check:links` i `check:mobile`

## Reczne testy (poza automatem)

Po uruchomieniu `npm run qa` nalezy recznie sprawdzic:

| Test | Jak sprawdzic |
|------|--------------|
| Focus trap draweru | Otworz drawer, Tab do ostatniego elementu -> powinien przeskoczyc na pierwszy. Shift+Tab odwrotnie. Escape zamyka drawer i przywraca focus do toggle. |
| Lenis po nawigacji | Kliknij link do innej strony, sprawdz czy Lenis restartuje i scroll dziala. |
| Overflow 320px | DevTools viewport 320x800, `document.documentElement.scrollWidth <= window.innerWidth` |
| Kotwice (#contact) | Kliknij CTA z hashem, sprawdz czy sekcja zatrzymuje sie ponizej navbaru. |
| Bez JavaScript | Wylacz JS w DevTools, sprawdz czy tresc jest widoczna. |
| prefers-reduced-motion | Wlacz w systemie/DevTools, sprawdz czy animacje sa wylaczone. |
| Drawer: przywrocenie focusu | Otworz drawer, zamknij Escape -> focus powinien wrocic do przycisku menu. |
| Drawer: klikniecie linku | Otworz drawer, kliknij link nawigacyjny -> drawer sie zamyka. |
| Drawer: klikniecie w tlo | Otworz drawer, kliknij backdrop -> drawer sie zamyka. |
| Kazda strona ma 1 h1 | Sprawdz w DevTools, czy kazda podstrona ma dokladnie jeden `<h1>`. |
| Formularz: label i pole | Sprawdz, czy kazde pole Input ma powiazany `<label>`. |

## Workflow: pierwsza strona klienta (krok po kroku)

### Krok 1: Dane firmy
Edytuj:
- `src/data/global/company.json` — nazwa, adres, telefon, email, NIP, social media
- `src/data/global/seo.json` — tytul, opis, URL, OG image
- `site.config.mjs` — URL, aktywny template, locale i BUILD_SCOPE
- `src/config/template.ts` — istniejące dane template'u, jeśli dana zmiana ich wymaga

### Krok 2: Nawigacja
Edytuj:
- `src/data/navigation/header.json` — menu i CTA
- `src/data/navigation/footer.json` — linki w stopce, newsletter, legal

### Krok 3: Strona glowna
Edytuj `src/data/pages/index.json` — wybierz sekcje z registry.

Jesli potrzebujesz nowej strony, utworz `src/data/pages/[slug].json`:
```json
{
  "seo": { "title": "...", "description": "..." },
  "sections": [
    { "id": "navbar", "variant": "centered" },
    { "id": "footer", "variant": "columns" }
  ]
}
```

### Krok 4: Formularz kontaktowy
- Uzyj prawdziwego endpointu (`action="https://formspree.io/f/xxxxx"`) lub `action=""` z JS
- Nigdy nie uzywaj `action="#"`
- Kazde pole Input musi miec `<label>` z `for` lub `aria-label`
- Stan bledu i sukcesu musi byc widoczny dla uzytkownika
- Domyślny handler używa SMTP z nadawcą `form@domena-klienta`.
- Adres `niepowiem51@gmail.com` jest wyłącznie odbiorcą testowym startera i musi zostać zmieniony przed wdrożeniem.
- Przed wdrożeniem ustaw host SMTP, hasło, konto `form@domena-klienta` oraz adres odbiorczy klienta w `public/send-form.php`.

### Krok 5: SEO i linki
- Kazda strona: dokladnie jeden `<h1>`
- Wszystkie linki wewnetrzne: trailing slash (`/kontakt/` nie `/kontakt`)
- Linki zewnetrzne: `target="_blank"` + `rel="noopener noreferrer"`
- Brak `href="#"` — uzyj prawdziwych URL lub `button`

### Krok 6: Mobile drawer
- `MenuToggle`: `aria-controls="site-nav-drawer"`, `aria-expanded`, `aria-label`
- `MobileDrawer`: `id="site-nav-drawer"`, `role="dialog"`, `aria-modal="true"`
- Kazdy link w drawerze: `data-navbar-close` (zamyka drawer po kliknieciu)
- Backdrop: `data-navbar-close` (zamyka po kliknieciu w tlo)
- Focus trap: Tab cykluje przez elementy draweru, Escape zamyka

### Krok 7: Placeholdery
Przed oddaniem klientowi:
```bash
npm run check:content
```
Musi pokazac 0 placeholderow. Jesli pokazuje wiecej, edytuj dane w `src/data/global/`.

### Krok 8: QA i build
```bash
npm run verify
npm run build
```

Przed publikacją projektu klienta uruchom również:

```bash
npm run qa:client
npm run check:seo:client
npm run check:form:client
```
Sprawdz `dist/` czy:
- Wszystkie strony maja poprawny HTML
- Kazda strona ma dokladnie jeden `<h1>`
- Linki maja trailing slash
- Formularze maja realny action (nie "#")

## Zasady dla AI

1. Przed rozpoczęciem pracy uruchom `npm run qa:help`.
2. Po każdej zmianie UI uruchom `npm run qa`.
3. Nie uznawaj zadania za zakończone bez wyniku `npm run qa`.
4. `npm run qa:client` może zakończyć się błędem przez placeholdery startera.
5. Źródło zadań znajduje się w `.docs/QA-TASKS.md`.
6. Po każdym commicie sprawdź, czy `npm run qa` nadal przechodzi.
7. Sprawdź rendered HTML w `dist/` przed finalną akceptacją.
