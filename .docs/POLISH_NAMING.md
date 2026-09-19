# Standardy Nazewnictwa (Polish Naming Standards)

Ten dokument definiuje zasady nazewnictwa w projekcie. Zgodnie z wymaganiami, **wszystkie** elementy konfiguracji Keystatic oraz danych wejściowych muszą być w języku polskim.

## 1. Klucze i Identyfikatory (Code / JSON / Keystatic)
Wszystkie klucze w plikach JSON, nazwy pól w Keystatic, nazwy kolekcji i singletonów **MUSZĄ** być w języku polskim.

- **Format**: `camelCase` (dla kluczy technicznych), `kebab-case` (dla nazw plików/folderów).
- **Dlaczego?** Pełna spójność języka polskiego w całym procesie zarządzania treścią.
- **Przykład klucza**:
  ```json
  {
    "nazwaFirmy": "Moja Firma",
    "kodPocztowy": "00-000"
  }
  ```
- **Przykład singletona**: `'firma'`, `'stopka'`, `'naglowek'`.

## 2. Etykiety UI (Keystatic Labels)
Wszystkie etykiety widoczne dla użytkownika w panelu CMS **MUSZĄ** być w języku polskim.

- **Format**: `Sentence case`.
- **Przykład**:
  ```typescript
  fields.text({ label: 'Pełna nazwa firmy' })
  ```

## 3. Kotwice i Linki (Anchors / Hrefs)
Kotwice wewnątrzstronowe **MUSZĄ** być w języku polskim, w formacie slugified.

- **Zasada**: Bez polskich znaków, małe litery, pauzy zamiast spacji.
- **Przykład**: `href: '#o-nas'`, `href: '#uslugi'`.

## 4. Wyjątki Techniczne
Dopuszczalne są nazwy angielskie tylko dla standardowych terminów technicznych, które nie mają dobrych odpowiedników lub są częścią zewnętrznych standardów (np. `seo`, `analytics`, `cta`, `href`).


---
**Zasada nadrzędna**: "Klucze i interfejs po polsku".

