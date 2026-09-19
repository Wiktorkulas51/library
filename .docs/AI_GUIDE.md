# AI Guide: Starter Kit

Ten plik jest skróconą mapą aktualnego projektu dla agenta AI. Zawsze sprawdź rzeczywisty kod, ponieważ registry i liczba komponentów zmieniają się w czasie.

## Kolejność pracy

1. Przeczytaj `AGENTS.md`, `DESIGN_RULES.md` i `.docs/CONTEXT.md`.
2. Uruchom `npm run qa:help`.
3. Sprawdź `git status --short --branch`.
4. Wyszukaj istniejący komponent przez `rg --files src/components`.
5. Sprawdź manifest, section registry, dane oraz test kontraktowy.
6. Wykonaj najmniejszą zmianę w odpowiedniej warstwie.
7. Uruchom `npm run verify` i sprawdź diff.

## Aktualny przepływ strony

```text
src/data/pages/[slug].json
  -> src/pages/[...page].astro
  -> src/components/PageBuilder.astro
  -> src/config/section-registry.ts
  -> src/config/component-map.ts
  -> src/components/registry/*.astro
  -> src/data/sections/*.json przez dataKey
```

Zwykła nowa strona wymaga pliku JSON, a nie nowego pliku `.astro`. Trasy bloga, dev i QA są wyjątkami opisanymi w `src/pages/`.

## Źródła prawdy

| Potrzeba | Źródło |
|---|---|
| Domena, template i zakres builda | `site.config.mjs` |
| Firma, SEO, formularz i dane globalne | `src/data/global/` |
| Header i footer | `src/data/navigation/` |
| Kolejność sekcji | `src/data/pages/` |
| Dane bloku | `src/data/sections/` |
| Publiczny katalog bloków | `src/config/component-manifest.ts` |
| ID sekcji i warianty | `src/config/section-registry.ts` oraz `src/config/section-registry/` |
| Kontrakty | `src/config/data-contracts.ts` |
| Globalne style | `src/styles/global.css` oraz importowane pliki w `src/styles/` |

Nie szukaj `src/config/site.ts` ani `src/styles/core.css`. Te pliki nie należą do aktualnej architektury.

## Warstwy komponentów

- `src/components/ui/atoms/`: pojedyncze elementy bez logiki biznesowej.
- `src/components/ui/molecules/`: powtarzalne połączenia atomów.
- `src/components/ui/layout/`: Section, Container i układy.
- `src/components/ui/patterns/`: powtarzalne wzorce interakcji.
- `src/components/registry/`: bloki wybierane przez PageBuilder.
- `src/components/dev/`: biblioteka podglądu i narzędzia lokalne.
- `src/studio/`: konfigurator i jego logika.

Reactowe pliki `*.tsx` bezpośrednio w `src/components/ui/` są elementami Studio albo narzędzi wewnętrznych. Nie przenoś ich automatycznie do warstwy Astro.

## Stylowanie

Tailwind jest pierwszym wyborem dla layoutu, odstępów, responsywności, rozmiarów i jednorazowych stylów bloku. CSS stosuj jako ostateczność dla tokenów, wspólnych systemów, pseudo-elementów i złożonych animacji. Przed dodaniem klasy CSS sprawdź istniejące utility, tokeny i komponenty.

## Dodawanie bloku

Przeczytaj `.docs/workflows/add-registry-section.md`.

Nowy blok wymaga:

1. komponentu Astro,
2. wpisu w `component-manifest.ts`,
3. wariantu w domenowym module section registry,
4. danych JSON, jeśli używa `dataKey`,
5. testu kontraktowego, jeśli jest potrzebny.

`component-map.ts` nie jest miejscem do ręcznego dopisywania każdego komponentu. Mapowanie korzysta z manifestu i globu.

## Kontrole

```powershell
npm run check:registrations
npm run check:data
npm run check:page-registry
npm run verify
```

`npm run verify` zaczyna build od wyczyszczenia `dist`, przywraca tymczasowo wyłączone strony i sprawdza, czy wynik nie zawiera tras developerskich.
