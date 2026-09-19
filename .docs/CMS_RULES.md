# CMS Rules — co klient może zmieniać, a czego nie

**Czytaj jako pierwsze przy onboardzie klienta i konfiguracji Sveltia CMS.**

Dokument definiuje podział: treści, które klient edytuje sam w panelu CMS, oraz
rzeczy, które zmienia wyłącznie WebScale w kodzie. Reguły egzekwuje
`public/admin/config.yml` oraz `check-hardcoded.ts`
(blokada treści wpisanych na sztywno w komponentach).

---

## 1. Zasada nadrzędna

- **JSON = jedyne źródło prawdy (SSOT).** Panel CMS edytuje pliki `src/data/**/*.json`.
- `public/admin/config.yml` jest **śledzony przez Git** i edytowany ręcznie przy zmianie pól CMS.
- Komponent `.astro` nigdy nie zawiera treści klienta (tylko puste fallbacki `|| ""`).
- Po zmianie struktury danych aktualizujemy `public/admin/config.yml` i uruchamiamy `npm run cms:check`.

## 2. Co klient MOŻE zmieniać sam (CMS)

| Obszar | Plik w src/data | Przykładowe pola |
|---|---|---|
| Dane firmy | `global/company.json` | nazwa, pełna nazwa, NIP/KRS, adres, telefon, e-mail, godziny, social media, logo, hasło przewodnie |
| Nawigacja | `navigation/header.json`, `navigation/footer.json` | menu, etykiety linków, przycisk CTA, kolumny stopki, linki prawne |
| SEO globalne | `global/seo.json` | nazwa serwisu, tytuł/opis domyślny, obraz OG, **ID analityki (GA4/GTM/FB/Clarity)** |
| Treści stron | `pages/*.json` | SEO strony (tytuł, opis), wybór aktywnych sekcji przez WebScale |
| Sekcje | `sections/*.json` | hero (tytuł, podtytuł, przyciski), oferta, o nas, galeria, opinie, FAQ, proces, kalkulator, portfolio, pasek partnerów |
| Formularz | `sections/contact.json`, `global/form-messages.json` | pola formularza, etykiety, komunikaty sukcesu/błędu, zgoda RODO, notka o prywatności |
| Strony prawne | `content/legal/*.json` | treść polityki prywatności, regulaminu, cookies |
| Blog | `content/blog/*.md` | wpisy (treść markdown, obraz, tagi) |
| Media | biblioteka mediów (uploady) | zdjęcia wgrywane do `/assets/uploads/` |

**Klient edytuje wyłącznie treść, nie wygląd.** Layout, kolory, warianty sekcji
są ustawiane przez WebScale w kodzie.

## 3. Czego klient NIE zmienia (zablokowane w CMS)

| Rzecz | Gdzie jest w kodzie | Dlaczego ukryte |
|---|---|---|
| Kolejność sekcji na stronie | `pages/*.json` → `sections[]` | układ strony to decyzja projektowa, zmiana rujnuje kompozycję |
| Wariant sekcji (np. FAQ flat/grid/list) | `pages/*.json` → `variant` | wariant wybiera WebScale na podstawie zawartości, klient widzi tylko treść |
| Stylizacja: kolory, fonty, spacing, animacje | design tokens, CSS | branding jest spójny z identyfikacją wizualną, klient nie może go zepsuć |
| Schema.org / znaczniki techniczne | `global/seo.json` → schemaTemplate, sectionPattern | zaawansowane SEO, błąd psuje widoczność w Google |
| SMTP, hasła, sekrety | `global/company.json` → smtp | bezpieczeństwo, konfiguracja przez WebScale |
| Podpis "Projekt i wdrożenie WebScale" | `footerAttribution` | element autorski WebScale |
| Teksty dostępności (aria-*) | różne JSON | techniczne, ukryte w panelu (widoczne dla czytników ekranu) |
| Copy UI: breadcrumbs, pagination, lightbox, legal | `navigation/breadcrumbs.json`, `navigation/pagination.json`, `global/lightbox.json`, `global/legal.json` | stałe etykiety interfejsu ("Poprzednia strona", "Ostatnia aktualizacja:"), pliki nie trafiają do panelu |
| Pola techniczne: version, id, order, uuid | różne JSON | wewnętrzne, nie do ruszania |

**Wyjątek:** ID analityki (GA4/GTM/FB Pixel/Clarity) klient może podmienić sam,
żeby nie angażować WebScale przy każdej zmianie konta pomiarowego.

## 4. Jak egzekwujemy te zasady

1. `public/admin/config.yml` — określa kolekcje, pola widoczne dla klienta i pola techniczne.
2. `check-hardcoded.ts` (pre-commit hook) — blokuje commity z treścią w komponentach zamiast JSON.
3. `check-content.ts` — pilnuje polskich znaków i braku placeholderów w danych produkcyjnych.

## 5. Workflow przy zmianach

- **Nowa treść dla klienta** → dodaj do istniejącego JSON, uruchom `npm run cms:check`.
- **Nowa sekcja/blok** → utwórz `sections/nowa-sekcja.json`, dopisz pola do `public/admin/config.yml`, uruchom `npm run cms:check`.
- **Pole ma zostać ukryte** → dodaj do `EXCLUDED_FIELDS` lub `hideFieldPath()` w generatorze.
- **Pole puste ma być widoczne dla klienta** → dodaj do `ALWAYS_KEEP_EMPTY` (np. ID analityki, youtubeId).
- Po każdej zmianie danych: `npm run cms:check` + `npm run build` + weryfikacja panelu.
- **Podgląd tego, co jest w panelu CMS:** `npm run cms:list` (kolekcje → pliki → pola, z oznaczeniem `[ukryte]` dla pól niewidocznych dla klienta).

## Powiązane
- `DESIGN_RULES.md` — preferencje wizualne (co wygląda dobrze, a czego nie robić)
- `.docs/CMS_STRUCTURE.md` — techniczna mapa JSON → config.yml
- `.docs/CONTENT_ARCHITECTURE.md` — architektura danych stron i sekcji
- `src/scripts/check-cms-config.ts` — walidator panelu
