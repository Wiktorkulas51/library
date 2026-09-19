# WebScale UI Library

Standalone katalog sprawdzonych komponentów i wariantów UI WebScale. Repozytorium służy do przeglądania inspiracji, testowania podglądów oraz wybierania sekcji do migracji do właściwego projektu. Nie zawiera logiki stron klientów, CMS ani wdrożeń FTP.

## Szybki start

```powershell
npm ci
npm run dev
```

Galeria jest dostępna pod `/`. Główne trasy to `/components/` dla podglądów komponentów oraz `/library/` dla filtrowania rodzin sekcji.

## Struktura

| Katalog | Odpowiedzialność |
|---|---|
| `src/components/ui/` | Atomy, molekuły, layouty i wzorce UI |
| `src/components/registry/` | Komponenty i warianty prezentowane w katalogu |
| `src/components/dev/component-library/` | Runtime galerii i podglądów |
| `src/data/dev/component-library/` | Metadane i dane katalogu |
| `src/data/sections/` | Dane potrzebne do renderowania wariantów |
| `src/config/` | Manifest, registry, mapowanie i kontrakty |
| `src/layouts/GalleryLayout.astro` | Lekki shell galerii |
| `src/scripts/` | Generatory i kontrole jakości biblioteki |

## Źródła prawdy

- `src/config/component-manifest.ts` opisuje komponenty.
- `src/config/section-registry.ts` opisuje rodziny i warianty sekcji.
- `src/data/dev/component-library/` opisuje katalog widoczny w galerii.
- `src/styles/global.css` oraz `DESIGN_RULES.md` definiują system wizualny.
- `site.config.mjs` definiuje konfigurację builda biblioteki.

## Kontrola jakości

```powershell
npm run check:types
npm run test -- --run
npm run build
npm run check:build-output
```

Przy zmianach wizualnych sprawdź także `/` oraz wybrany podgląd w szerokościach mobilnych i desktopowych.

## Dodawanie wariantu

1. Wybierz istniejącą rodzinę sekcji i sprawdź jej manifest.
2. Dodaj komponent oraz dane zgodnie z istniejącymi wzorcami.
3. Dodaj metadane potrzebne do galerii i podglądu.
4. Uruchom kontrole typów, testy, build i sprawdzenie wyniku builda.
5. Zweryfikuj wariant wizualnie w galerii.
