# Roadmap & Przyszłe Zadania

Dokument zawiera listę planowanych usprawnień i funkcji, które nie zostały jeszcze wdrożone, ale są istotne dla rozwoju projektu.

## 1. Treści i i18n
- [ ] **Multi-language Support (Wielojęzyczność)**:
  - Ujednolicenie struktur językowych w `src/data/sections/`.
  - Wydzielenie wspólnych typów danych dla wariantów PL i EN.
  - Integracja z routingiem Astro dla `/en/` i `/pl/`.

## 2. Testy i Walidacja
- [ ] **Visual Regression Testing**: Wdrożenie narzędzia do porównywania screenshotów bloków (np. Playwright), aby upewnić się, że zmiany w CSS nie psują istniejących układów.
- [ ] **A11y Automated Checks**: Dodanie testów dostępności (axe-core) dla każdego bloku w rejestrze.

## 3. Architektura
- [x] **Modularizacja Stron (Composition Mode)**:
  - `PageBuilder.astro` renderuje bloki na podstawie tablicy sekcji w `src/data/pages/*.json`.
  - Dalsza praca powinna skupić się na typowaniu i porządkowaniu registry bez zmiany wyglądu bloków.
- [ ] **Shared Types Library**: Wydzielenie wspólnych interfejsów TypeScript do osobnego pliku (np. `src/types/blocks.ts`).

## 4. Narzędzia (Studio)
- [ ] **Asset Manager**: System do zarządzania i optymalizacji obrazów przesyłanych przez użytkownika.
