# Plan porządkowania architektury Starter Kita

Ten dokument opisuje bezpieczny kierunek refaktoryzacji na podstawie aktualnego stanu repozytorium. Zmiany mają zachować działanie istniejących stron i nie mogą usuwać bloków tylko dlatego, że są starsze.

## Stan wejściowy

- `src/config/section-registry.ts` zawiera 165 wpisów i jest aktualnym źródłem prawdy dla sekcji PageBuildera.
- `src/components/registry/` zawiera 171 publicznych bloków Astro na poziomie katalogu oraz 183 pliki Astro razem z podkatalogami.
- `src/config/component-manifest.ts` zawiera jawną listę publicznych bloków oraz klasyfikację `core`, `client`, `catalog`, `legacy`.
- `src/data/sections/` zawiera 250 plików danych, a loader obsługuje obecnie także podkatalogi bez zmiany istniejącego `dataKey`.
- Astro UI jest w `src/components/ui/atoms/`, `molecules/` i `layout/`.
- React UI to 45 komponentów `*.tsx` bezpośrednio w `src/components/ui/`.
- `src/studio/` zawiera logikę konfiguratora, a `src/components/dev/component-library/` komponenty Astro biblioteki developerskiej.
- `src/styles/core.css` ma około 1884 linii i łączy tokeny, bazę, komponenty oraz animacje.
- Największe bloki to `HeroSplitBlock`, `AboutTomRosBlock`, `CardsFilterableBlock`, `ContactInfoFormBlock` i `FooterContactBlock`.

## Zasady refaktoryzacji

1. Najpierw dokumentacja i QA bazowe, dopiero potem zmiany strukturalne.
2. Jedna zmiana logiczna na osobny checkpoint.
3. Nie przenosimy masowo plików i nie zmieniamy publicznych identyfikatorów sekcji.
4. Zachowujemy jeden eksport registry, nawet jeśli implementacja zostanie podzielona na domeny.
5. Po każdym etapie uruchamiamy testy, sprawdzamy importy i przeglądamy diff.

## Kolejność prac

### Etap 0, dokumentacja i źródła prawdy

Wskazaliśmy `src/config/section-registry.ts` jako źródło prawdy dla sekcji, rozdzieliliśmy Astro UI, React UI, bloki PageBuildera i Studio oraz opisaliśmy plan podziału registry na `core`, `client`, `catalog` i `legacy` bez usuwania komponentów.

### Etap 1, bazowy QA

Najpierw trzeba ustabilizować gate QA i rozdzielić błędy odziedziczone od regresji. Zakres obejmuje testy jednostkowe i kontraktowe, `check:imports`, `check:registrations`, `check:atomic`, mobile QA oraz build produkcyjny. Nie zaczynamy refaktoryzacji struktury bez zapisanej listy czerwonych testów bazowych.

### Etap 2, manifest i loader bez zmiany zachowania

W pierwszej kolejności dodajemy jawny manifest publicznych bloków, rekurencyjne wyszukiwanie implementacji oraz wspólny loader danych obsługujący podkatalogi. Publiczne identyfikatory sekcji i istniejące `dataKey` pozostają bez zmian. Komponenty pomocnicze z podkatalogów nie są automatycznie wystawiane do PageBuildera.

### Etap 3, registry bez zmiany zachowania

Pogrupować wpisy `section-registry.ts` według domen, na przykład hero, about, services, portfolio, process, social, faq, contact, shell i footer, a następnie składać je w jeden eksport zachowujący ten sam kontrakt.

Następnie uzupełniać klasyfikację bloków jako `core`, `client`, `catalog` albo `legacy`. Klasyfikacja powinna opierać się na użyciu i kontrakcie, nie na samej nazwie pliku. Przed zmianą trzeba sprawdzić referencje w `src/data/pages/`, testach, Studio i component map.

### Etap 4, rozdzielenie Astro UI i React UI

- Astro UI pozostaje w `src/components/ui/atoms/`, `molecules/` i `layout/`.
- React UI pozostaje bezpośrednio w `src/components/ui/*.tsx` do czasu wyodrębnienia osobnego katalogu domenowego.
- Logika konfiguratora pozostaje w `src/studio/`, a UI biblioteki developerskiej w `src/components/dev/component-library/`.
- Nowe komponenty React nie powinny trafiać do katalogów Astro, a nowe komponenty Astro nie powinny trafiać do Studio bez uzasadnienia.

Ewentualne `ui/react/` lub `ui/react/sections/` należy wprowadzać dopiero razem z mapą importów i migracją małymi partiami.

### Etap 5, podział `core.css`

Podział powinien zachować kolejność ładowania i ten sam publiczny zestaw klas:

1. `tokens.css`, zmienne i tokeny tematów.
2. `base.css`, reset, bazowe elementy i ustawienia globalne.
3. `components.css`, klasy `ui-*` i wspólne wzorce komponentów.
4. `animations.css`, reveal, motion i stany ograniczenia ruchu.

Najpierw przenieść całe sekcje reguł bez zmian wizualnych. Po każdym pliku uruchomić build i porównać wynik w aktualnym widoku.

### Etap 6, ekstrakcja logiki z największych bloków

1. `HeroSplitBlock`, normalizacja danych i konfiguracja wariantów.
2. `AboutTomRosBlock`, mapowanie treści oraz dane dekoracyjne.
3. `CardsFilterableBlock`, model filtrów, limitowanie i etykiety lokalizacyjne.
4. Następnie `ContactInfoFormBlock` i `FooterContactBlock`, po potwierdzeniu wzorca.

Komponent Astro powinien pozostać cienką warstwą renderującą. Logika możliwa do przetestowania bez renderowania HTML powinna trafić do `src/utils/` albo do lokalnego modułu domenowego.

## Kryterium zakończenia

Etap uznajemy za gotowy, gdy dokumentacja wskazuje aktualne ścieżki, registry zachowuje ten sam eksport i identyfikatory, testy nie mają nowych czerwonych wyników, a build przechodzi dla aktualnego zakresu stron.
