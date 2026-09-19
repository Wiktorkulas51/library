# Starter Kit, kontrakt wewnętrzny

Starter Kit jest wewnętrznym narzędziem WebScale do uruchamiania stron klientów. Nie jest produktem do sprzedaży.

## Cel

Nowy projekt klienta ma być gotowy do pracy po jednym poleceniu, z działającym buildem, formularzem, CMS, SEO, responsywnością i checklistą oddania.

## Tryb pracy

1. Starter Kit jest źródłem kodu i konfiguracji bazowej.
2. Każdy klient otrzymuje osobną kopię projektu.
3. Projekt klienta nie importuje kodu ze Starter Kita w czasie działania.
4. Zmiany wspólne są najpierw testowane w Starter Kicie, a następnie przenoszone do nowych projektów.
5. Treści klienta znajdują się w `src/data/**/*.json` albo w kolekcjach treści. Komponenty renderują dane i nie przechowują copy klienta.

## Źródła prawdy

| Zakres | Źródło |
|---|---|
| Dane firmy | `src/data/global/company.json` |
| SEO globalne | `src/data/global/seo.json` |
| Nawigacja | `src/data/navigation/` |
| Treści sekcji | `src/data/sections/` |
| Kolejność stron | `src/data/pages/` |
| URL i zakres buildu | `site.config.mjs` |
| Tokeny wizualne | `design/*.md` |
| Konfiguracja CMS | ręcznie utrzymywany `public/admin/config.yml` |

## Bramka przed oddaniem klientowi

- `npm run qa` przechodzi bez błędu.
- `npm run qa:client` przechodzi bez placeholderów.
- `npm run build:prod` tworzy wyłącznie zamówione strony.
- Formularz został wysłany na prawdziwym hostingu.
- CMS zmienia treść po pełnym przepływie JSON, config, build, strona.
- Strona została sprawdzona ręcznie na wymaganych szerokościach.
- Zostały sprawdzone canonical, robots, sitemap, schema i meta tagi.
- Został wykonany test live po deployu.

## Czego nie robimy

- Nie rozwijamy biblioteki bloków bez dowodu, że skraca pracę przy realnym kliencie.
- Nie utrzymujemy dwóch konkurencyjnych źródeł tej samej treści.
- Nie uznajemy zielonego buildu za dowód poprawnego działania live.
- Nie commitujemy sekretów, danych klientów ani raportów lokalnych.
