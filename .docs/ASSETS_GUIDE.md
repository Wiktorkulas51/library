# 🎨 Przewodnik po Branding i Assetach

Ten projekt posiada zautomatyzowany system zarządzania identyfikacją wizualną i optymalizacją mediów.

## 1. Dynamiczne Logo (`Logo.astro`)
Komponent logo automatycznie generuje branding na podstawie danych z `src/data/global/company.json`.

### Konfiguracja w `company.json`:
```json
"branding": {
  "icon": "ph-house-line", // Ikona z biblioteki Phosphor Icons
  "tagline": "Profesjonalizm i Jakość",
  "useImage": false // Zmień na true, aby użyć pliku logo.svg z folderu public/
}
```

### Tryby pracy:
- **Tryb Automatyczny (`useImage: false`)**: Generuje logo z ikony + nazwy firmy. Wspiera warianty `light` (do ciemnych tła) i `dark`.
- **Tryb Pliku (`useImage: true`)**: Wyświetla plik `/logo.svg`.

---

## 2. Automatyczne Favicony
Favicony są generowane automatycznie z ikony firmowej lub pliku SVG.

**Komenda**: `npm run assets:gen`

**Jak to działa?**
1. Skrypt szuka pliku `public/icon.svg`.
2. Jeśli go nie ma, używa ikony domyślnej w kolorze brandowym projektu.
3. Generuje komplet plików (favicon.ico, apple-touch-icon.png itp.) do folderu `public/`.

---

## 3. Optymalizacja Zdjęć (Magic Image Engine)
System do masowej optymalizacji zdjęć od klienta. Konwertuje źródła do AVIF i WebP, skaluje je oraz czyści nazwy.

**Komenda**: `npm run assets:img`

### Workflow:
1. **Wrzuć** surowe zdjęcia (JPG/PNG) do `src/assets/raw/` (możesz używać podfolderów).
2. **Uruchom** `npm run assets:img`.
3. **Gotowe pliki** znajdziesz w `public/assets/images/` z wyczyszczonymi nazwami (slugified).

### Parametry (konfigurowalne w `src/scripts/optimize-images.ts`):
- **Format**: AVIF z fallbackiem WebP.
- **Jakość WebP**: 80%.
- **Jakość AVIF**: 50%.
- **Warianty**: 220 px dla miniaturek, 800 px dla standardu, 1600 px dla ekranów retina.
- **Nazewnictwo**: Automatyczna zamiana spacji i polskich znaków na myślniki.
- **Oryginały**: `src/assets/raw/`.
- **Warianty publiczne**: `public/assets/images/`.

### Ważne ograniczenie

Obrazy w `public/` nie są optymalizowane przez Astro. Dla zdjęć z CMS trzeba używać pipeline'u assetów albo zewnętrznego image CDN. `SmartImage` może automatycznie użyć wariantów `@220`, `@1600` oraz AVIF, jeśli istnieją.

---

## 4. Przydatne komendy
- `npm run assets:gen` - Tylko favicony.
- `npm run assets:img` - Tylko optymalizacja zdjęć.
- `npm run build` - Pełny build (generuje assety, optymalizuje zdjęcia i buduje stronę).
