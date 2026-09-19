# Contributing

Ten dokument opisuje pracę człowieka w Starter Kicie. Instrukcje dla agentów AI znajdują się w `AGENTS.md`.

## Start nowej osoby

1. Użyj Node.js zgodnego z `package.json`, obecnie minimum `22.12.0`.
2. Uruchom `npm ci`.
3. Uruchom `npm run dev` i otwórz stronę główną oraz `/dev/components/`.
4. Przeczytaj [README.md](README.md), [.docs/CONTEXT.md](.docs/CONTEXT.md) oraz [.docs/COMPONENTS.md](.docs/COMPONENTS.md).
5. Przed pierwszą zmianą uruchom `npm run verify`, aby znać bazowy stan repozytorium.

## Zasada architektury

Treść trafia do JSON. Konfiguracja strony znajduje się w `src/data/pages/`, dane sekcji w `src/data/`, a komponenty tylko je renderują. PageBuilder korzysta z section registry oraz component manifest. Nie twórz osobnej trasy Astro, jeśli stronę można opisać przez konfigurację JSON.

Warstwy komponentów mają różne role:

- `ui/atoms`: pojedyncze elementy bez logiki biznesowej.
- `ui/molecules`: powtarzalne połączenia atomów.
- `ui/layout`: Section, Container, Grid i układ strony.
- `ui/patterns`: powtarzalne wzorce interakcji.
- `registry`: kompletne bloki wybierane w konfiguracji strony.
- `components/dev`: podgląd i narzędzia lokalne.

## Dodawanie zmian

### Zmiana treści

Edytuj właściwy plik JSON. Nie przenoś treści klienta do komponentu Astro. Po zmianie uruchom `npm run cms:check` oraz `npm run verify`.

### Zmiana istniejącego bloku

Najpierw sprawdź użycia w `src/config/section-registry.ts`, dane `dataKey` i test kontraktowy. Zmiana wspólnego bloku może wpłynąć na wiele stron, dlatego po zmianie uruchom pełną bramkę `npm run verify`.

### Nowy blok

Postępuj według [.docs/workflows/add-registry-section.md](.docs/workflows/add-registry-section.md). Nie dodawaj wpisu tylko do jednego rejestru. Kontrola `check:registrations` ma potwierdzić kompletność manifestu, registry i pliku komponentu.

### Stylowanie

Tailwind jest pierwszym wyborem dla layoutu, odstępów, breakpointów, rozmiarów i jednorazowych stylów bloku. CSS stosuj dopiero dla tokenów, wspólnych systemów, pseudo-elementów albo złożonych animacji. Przed dodaniem nowej klasy sprawdź istniejące utility, tokeny i komponenty.

## Build i zakres stron

`site.config.mjs` definiuje `BUILD_SCOPE`. Podczas builda skrypt może tymczasowo przenieść strony poza zakresem do `src/pages/_disabled/`, a następnie zawsze je przywraca. Nie uruchamiaj ręcznie etapu `stage`. Jeśli po przerwanym buildzie katalog nie jest pusty, uruchom `npm run scope:restore` i dopiero potem kontynuuj pracę.

Każdy build zaczyna od wyczyszczenia `dist`, dlatego wynik nie może zależeć od poprzednich plików. `npm run check:build-output` sprawdza brak tras developerskich oraz odnośników do biblioteki komponentów.

## Praca z Git

- Nie pracuj bezpośrednio na `master` ani `main`.
- Przed rozpoczęciem sprawdź `git status --short --branch`.
- Nie usuwaj ani nie resetuj zmian, których nie rozpoznajesz.
- Stage'uj konkretne pliki, nigdy bezrefleksyjnie całe repozytorium.
- Przed commitem uruchom `git diff --check`, testy i właściwy profil QA.
- Pull request powinien opisywać zakres, testy oraz ryzyka.

## Definition of Done

Zmiana jest gotowa, gdy:

1. Kod i dane są w odpowiednich warstwach.
2. `npm run verify` przechodzi bez nowych ostrzeżeń krytycznych.
3. Build nie zawiera stron developerskich ani starych plików z `dist`.
4. Zmiana została sprawdzona w przeglądarce, jeśli dotyczy renderowania lub interakcji.
5. Diff zawiera wyłącznie pliki związane z zadaniem.

## Ręczna kontrola

Po zmianach UI sprawdź stronę główną, zmienioną trasę, szerokości 320, 375, 390 i 414 pikseli oraz podstawową obsługę klawiaturą. Test automatyczny nie zastępuje sprawdzenia wyglądu i działania w przeglądarce.
