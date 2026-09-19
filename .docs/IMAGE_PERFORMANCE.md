# Wydajność obrazów

Ten dokument opisuje kontrakt obrazów w UI Library. Należy go przeczytać przed zmianą `SmartImage.astro`, `optimize-images.ts` albo danych galerii.

## Zasada źródła

- Oryginalne zdjęcia projektowe trafiają do `src/assets/raw/`.
- Oryginalne uploady Sveltia CMS trafiają do `public/assets/uploads/` i nie są nadpisywane.
- Skrypt `npm run assets:img` generuje odpowiednio `public/assets/images/` oraz `public/assets/upload-derivatives/`.
- Każdy wariant ma WebP oraz AVIF.
- Dostępne szerokości to 220, 480, 640, 800, 1080, 1280, 1600 i 1920 px. Wariant 800 zachowuje nazwę bez sufiksu dla zgodności z istniejącymi danymi.
- `SmartImage` buduje `srcset` wyłącznie z plików, które istnieją, i wybiera AVIF przed WebP.

## Dlaczego nie używamy szerokiego globu

`SmartImage` nie może importować całego `src/assets/**/*`. Taki glob może wciągnąć oryginalne zdjęcia, makiety i assety demonstracyjne do builda, nawet gdy dana strona ich nie renderuje. Obrazy importowane bezpośrednio przez komponenty powinny przechodzić przez Astro `Image` albo `Picture`.

## Loading i priorytety

- Obraz hero, który jest rzeczywistym LCP, powinien mieć `loading="eager"` i `fetchpriority="high"`.
- Galerie i obrazy poniżej pierwszego ekranu powinny mieć `loading="lazy"`.
- Miniatur nie preloadujemy hurtowo. Preload jest uzasadniony tylko dla jednego obrazu, który rzeczywiście jest LCP.
- Każdy obraz musi mieć `alt`, `width`, `height` oraz `decoding="async"`, chyba że jest to dynamiczny obraz lightboxa.

## CMS i `public/`

Astro nie optymalizuje plików w `public/`. Ten projekt uruchamia więc własny pipeline Sharp przed buildem. Upload zostaje w `public/assets/uploads`, a jego pochodne są tworzone w `public/assets/upload-derivatives`. `SmartImage` rozpoznaje oba katalogi i nie emituje niedziałających wpisów `srcset`.

Nie przenosimy całego `public/` do `src/`. Favicony, pliki CMS i adresy przeznaczone do bezpośredniego użycia mają pozostać publiczne. Obrazy importowane wprost przez komponenty z `src/` przechodzą przez Astro `Picture`, które tworzy warianty w buildzie.

## Checklist dla kolejnego agenta

1. Sprawdź, czy nowy obraz pochodzi z `src/`, `public/` czy zdalnego CDN.
2. Sprawdź wynik w `dist`, nie tylko kod źródłowy.
3. Dla obrazów lokalnych sprawdź obecność `srcset`, `sizes` i preferowanego formatu AVIF lub WebP.
4. Dla galerii sprawdź, czy istnieją warianty `@220` oraz `@1600`, a dla CMS także katalog `upload-derivatives`.
5. Nie dodawaj globalnego preloadu dla wielu obrazów.
6. Po zmianach uruchom `npm run assets:img`, `npm run build` oraz `npm run check:images`.
