---
title: Block Preferences
tags: [starter-kit, blocks, preferences, workflow]
type: concept
date: 2026-09-13
---

# Block Preferences

Ten dokument określa sposób wyboru bloku. Nie jest ręcznie utrzymywaną listą wszystkich komponentów. Aktualny katalog wynika z `src/config/component-manifest.ts` oraz `src/config/section-registry.ts`.

## Zasada wyboru

1. Najpierw użyj istniejącego bloku z kategorią `core`.
2. Jeśli wymagany jest podgląd albo wireframe, sprawdź kategorię `catalog`.
3. Bloki kategorii `client` traktuj jako źródło wariantu do adaptacji, a nie jako domyślny wybór dla każdej strony.
4. Bloku `legacy` nie używaj bez świadomej decyzji i uzasadnienia w review.
5. Jeśli żaden istniejący blok nie pasuje przez propsy lub wariant, utwórz nowy z atomów i layoutów.

## Obowiązkowa kolejność sprawdzania

1. `src/components/registry/`
2. `src/config/component-manifest.ts`
3. `src/config/section-registry.ts` oraz właściwy moduł domenowy
4. `src/data/sections/`
5. testy kontraktowe

## Reguły jakości

- `Navbar` i `Footer` wybieraj z istniejących komponentów shell.
- Blok powinien korzystać z `Section`, `Container`, `Heading`, `Text`, `Button` i `SmartImage`.
- Treści oraz listy danych przechowuj w JSON.
- Nie powielaj wariantu tylko z powodu innego tekstu albo koloru tokenu.
- Nie dodawaj ogólnych bloków 3-kolumnowych bez uzasadnienia w wymaganiu.
- Nie dodawaj kropek, pulsowania ani przypadkowych badge'y bez decyzji designu.
- Każdy nowy blok musi przejść `npm run check:registrations` i `npm run verify`.

## Klasyfikacja po wdrożeniu

Po pierwszym użyciu bloku sprawdź, czy nadal jest `provisional`, czy powinien otrzymać status `confirmed`. Zmiana kategorii wymaga krótkiego uzasadnienia w pull requeście.
