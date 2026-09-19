# Dodawanie nowej sekcji do registry

Ten workflow dotyczy bloku, który ma być wybierany przez PageBuilder w konfiguracji JSON.

## 1. Sprawdź istniejące rozwiązania

1. Przeszukaj `src/components/registry/`.
2. Sprawdź atomy i layouty w `src/components/ui/`.
3. Sprawdź `src/config/component-manifest.ts`.
4. Sprawdź właściwy moduł w `src/config/section-registry/`.
5. Sprawdź dane i `dataKey` w `src/data/sections/`.

Jeśli istniejący blok obsługuje wymagany układ przez propsy lub wariant, użyj go zamiast tworzyć kolejny komponent.

## 2. Utwórz komponent

Dodaj plik `src/components/registry/[domain]/[Name]Block.astro` albo plik w katalogu głównym, jeśli taki układ jest już używany przez daną rodzinę.

- Używaj `Section`, `Container`, `Heading`, `Text`, `Button` i `SmartImage`.
- Treść i dane list przechowuj w JSON.
- Style opieraj na istniejących tokenach i klasach globalnych.
- Nie używaj `src/styles/core.css`, ponieważ taki plik nie istnieje.
- Nie dodawaj domyślnych danych klienta bezpośrednio do frontmatteru.
- Dodaj test kontraktowy, jeśli struktura HTML albo skrypt klienta jest częścią kontraktu.

## 3. Zarejestruj blok

1. Dodaj komponent do `src/config/component-manifest.ts` z kategorią i statusem.
2. Dodaj wariant do właściwego modułu `src/config/section-registry/[domain].ts`.
3. Upewnij się, że `dataKey` wskazuje istniejący plik danych.
4. Nie edytuj ręcznie `component-map.ts`, ponieważ mapowanie korzysta z manifestu i globu komponentów.

Przykładowy wpis manifestu:

```ts
NewServicesBlock: { category: "core", status: "provisional" },
```

Przykładowy wybór w konfiguracji strony:

```json
{
  "id": "services",
  "variant": "newServices"
}
```

## 4. Zweryfikuj integrację

Uruchom kolejno:

```powershell
npm run check:registrations
npm run check:data
npm run check:page-registry
npm run test
npm run verify
```

Po zmianie renderowania sprawdź również `/dev/components/` oraz stronę używającą nowego wariantu.

## 5. Definition of Done

Blok jest gotowy, gdy ma komponent, manifest, registry, dane, testy odpowiednie do ryzyka, działający podgląd oraz przechodzący pełny `npm run verify`.
