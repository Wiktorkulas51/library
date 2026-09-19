# Architektura danych Starter Kita

Starter Kit składa stronę z gotowych bloków registry oraz danych JSON. Konfiguracja strony opisuje kolejność sekcji i warianty, a pliki sekcji przechowują treści oraz dane prezentacyjne.

## Źródła danych

```text
src/data/
├── pages/       # SEO, H1 i kolejność sekcji na stronie
├── sections/    # Treści i dane bloków registry
├── global/      # Firma, SEO, kod własny i ustawienia globalne
└── navigation/  # Nawigacja i stopka
```

## Konfiguracja strony

Plik `src/data/pages/[slug].json` wybiera sekcje dostępne w `src/config/section-registry.ts`.

```json
{
  "heading": "Nasze usługi",
  "sections": [
    { "id": "navbar", "variant": "plain" },
    { "id": "features", "variant": "default" },
    { "id": "footer", "variant": "columns" }
  ]
}
```

`PageBuilder.astro` rozwiązuje identyfikator sekcji, wariant, komponent oraz opcjonalny `dataKey`. Dzięki temu nowa strona może powstać przez konfigurację danych bez pisania osobnego layoutu Astro.

## Dane sekcji

Wariant registry może wskazywać plik przez `dataKey`, na przykład `hero-split` wskazuje `src/data/sections/hero-split.json`. Komponent może również przyjmować propsy z konfiguracji wariantu. Kolejność nadpisywania jest następująca:

1. Propsy przekazane przez PageBuilder.
2. Dane z pliku wskazanego przez `dataKey`.
3. Bezpieczny fallback komponentu, jeśli jest potrzebny do pustego podglądu Studio.

## Zasady dla nowych bloków

1. Komponent należy dodać do `src/components/registry/`.
2. Treści i dane należy dodać do `src/data/sections/`.
3. Wariant trzeba zarejestrować w `src/config/section-registry.ts`.
4. Należy dodać test kontraktowy, jeśli blok ma zachowanie lub strukturę ważną dla klienta.
5. Należy uruchomić `npm run check:registrations`, `npm run check:page-registry` oraz testy Vitest.

`src/config/template.ts` pozostaje wyłącznie elementem konfiguracji aktywnego motywu oraz istniejących stron prawnych. Nie jest źródłem treści bloków.

## Walidacja danych

`npm run check:data` sprawdza, czy pliki JSON stron i sekcji zachowują wspólną strukturę.
Kontrakt pilnuje typów pól konfiguracyjnych, identyfikatora oraz wariantu sekcji, ale nie ogranicza pól treści konkretnego bloku.
Po tej kontroli `npm run check:page-registry` nadal sprawdza powiązania z registry, komponentami i `dataKey`.
