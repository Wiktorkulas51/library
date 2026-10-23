# VersionToolbar, prototypowanie wariantów UI

## Co to jest

`VersionToolbar` (`src/components/dev/VersionToolbar.astro`) to kompaktowy pasek widoczny na stronach developerskich. Layout dodaje go automatycznie, także gdy strona ma `clientRuntime={false}`. Warianty można przełączać bez przeładowania strony. Sterowanie działa klawiaturą i dotykiem.

`VersionGroup` (`src/components/dev/VersionGroup.astro`) opisuje bazową wersję i dostępne alternatywy. W buildzie produkcyjnym renderowana jest wyłącznie wersja bazowa. Nie dodawaj osobnych tras demonstracyjnych ani sztucznych wariantów.

## Dodawanie grupy

Najpierw znajdź właściwy komponent i przygotuj rzeczywiste alternatywy do porównania. Bazowy slot `original` jest wymagany. Sloty wariantów są opcjonalne i pojawią się w pasku tylko wtedy, gdy mają zawartość.

```astro
<VersionGroup id="hero" label="Hero" labels={{ v1: 'Kompaktowy' }}>
  <Hero slot="original" />
  <CompactHero slot="v1" />
</VersionGroup>
```

Id grupy i identyfikatory wariantów mogą zawierać litery, cyfry, `_` i `-`. Pierwsza widoczna wersja to `original`. Nie duplikuj istniejącej sekcji, dopóki nie ma konkretnego wariantu do sprawdzenia.

## Stan wyboru

Parametr URL `sv` pozwala wskazać wybrane warianty, np. `?sv=hero:v2,cta:v1`. Wybór z URL ma pierwszeństwo przed zapamiętanym wyborem. Bez parametru pasek przywraca stan z `sessionStorage`, osobno dla każdej ścieżki. Zmiana wariantu aktualizuje `sv`, zachowując pozostałe parametry URL.

Nie trzeba dodawać `?vt=1`. Pasek działa na wszystkich stronach developerskich, również gdy nie ma wariantów. W takim przypadku pokazuje informację, że strona nie zawiera wariantów.

## Presety CSS

Dla różnic ograniczonych do zmiennych CSS można użyć elementu z `data-css-toggle-group` i tablicą JSON w `data-css-toggle-presets`:

```html
<div
  data-css-toggle-group="Kolory"
  data-css-toggle-presets='[
    {"label":"Ciemny","props":{"--bg":"#0a0a0a","--text":"#fff"}},
    {"label":"Jasny","props":{"--bg":"#fafafa","--text":"#111"}}
  ]'
>
```

Każdy preset wymaga etykiety `label`; `props` może ustawiać zmienne CSS na elemencie. Potrzebne są co najmniej dwa presety.

## Workflow

1. Przeczytaj istniejący komponent i zachowaj jego bazowy wygląd w slocie `original`.
2. Dodaj tylko alternatywy potrzebne do podjęcia konkretnej decyzji projektowej.
3. Sprawdź stronę w dev i przełącz każdy wariant z paska. `sv` można skopiować, aby odtworzyć ten sam wybór.
4. Po zatwierdzeniu kierunku usuń tymczasowe warianty albo przenieś wybraną implementację do głównego komponentu.

Miniatury katalogu przekazują `devTools={false}`, aby nie renderować narzędzi w ich ramkach. Inne powierzchnie mogą wyłączyć pasek tym samym propem layoutu.