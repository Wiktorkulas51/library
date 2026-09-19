# VersionToolbar — prototypowanie wariantów UI

## Co to jest

VersionToolbar (`src/components/dev/VersionToolbar.astro`) to sticky pasek na dole strony, aktywny tylko w dev. Skanuje DOM w poszukiwaniu grup `data-version-group` i pozwala przełączać wersje UI bez reloadu: klik w pasek albo parametr `?sv=` w URL.

Jest podpięty raz w `src/layouts/GalleryLayout.astro` (import oraz render na końcu `<body>`), więc działa na lokalnych stronach galerii. Nie dodawaj nowych tras developerskich. Podgląd uruchamiaj z poziomu rootu `/`.

## Jak włączyć

Dodaj `?vt=1` do URL strony, np. `http://localhost:4321/?vt=1`. Pasek pojawia się na dole. Bez tego parametru toolbar jest ukryty, nawet jeśli w DOM są warianty.

## Atrybuty HTML

| Atrybut | Opis |
|---------|------|
| `data-version-group="{nazwa}"` | Kontener grupujący wersje jednej sekcji (np. "hero", "products") |
| `data-version="{id}"` | Pojedyncza wersja; tylko aktywna jest widoczna |
| `data-version-label="{etykieta}"` | Czytelna nazwa przycisku w pasku (np. "Kierunek A") |
| `data-css-toggle-group="{nazwa}"` | Grupa presetów CSS (szybkie eksperymenty bez duplikowania HTML) |
| `data-css-toggle-presets='[{"label":"Ciemny","props":{"--bg":"#0a0a0a"}}]'` | Presety przełączające zmienne CSS na kontenerze |

## URL state

Wybór trzyma się w URL (`?sv=grupa:wersja`, wiele grup po przecinku: `?sv=hero:v2,cta:banner`) i w localStorage. Link z `?sv=` można wysłać użytkownikowi, żeby zobaczył konkretną wersję bez klikania.

## Workflow dla AI (krok po kroku)

1. **Znajdź komponent** sekcji (np. `src/components/registry/HeroBlock.astro`).
2. **Przygotuj eksplorację:** przeczytaj komponent, owiń istniejącą treść w:
   ```astro
   <section data-version-group="hero">
     <div data-version="original" data-version-label="Oryginał">
       <!-- istniejąca treść -->
     </div>
   </section>
   ```
   Pierwsza wersja ZAWSZE `data-version="original"` (kopia obecnego stanu).
3. **Dodaj warianty:** 2-3 alternatywy w tym samym pliku:
   ```astro
   <div data-version="v2" data-version-label="Kierunek A" style="display:none">
     <!-- nowy układ -->
   </div>
   ```
   NIE twórz osobnych plików. Używaj czytelnych etykiet.
4. **Odśwież stronę** z `?vt=1` i sprawdź, czy pasek pokazuje grupę i wersje jako przyciski.
5. **Prezentacja:** powiedz użytkownikowi: "są 3 wersje, przełączaj paskiem na dole strony".
6. **Decyzja i czyszczenie:** po wyborze skopiuj wybraną wersję na główny poziom i usuń WSZYSTKIE `data-version-group` oraz `data-version`. Nigdy nie zostawiaj martwych divów ani ukrytych wersji.
7. **CSS toggle** (gdy warianty różnią się tylko kolorami, nie strukturą):
   ```html
   <div data-css-toggle-group="kolory" data-css-toggle-presets='[
     {"label":"Ciemny","props":{"--bg":"#0a0a0a","--text":"#fff"}},
     {"label":"Jasny","props":{"--bg":"#fafafa","--text":"#111"}}
   ]'>
   ```
   Komponent używa `var(--bg)` i `var(--text)` w stylach. Zero duplikowania HTML.

## Zasady

- Warianty są TYMCZASOWE, zawsze czyść po decyzji użytkownika.
- Wszystko w jednym pliku komponentu, zero osobnych plików.
- Po każdej zmianie odśwież stronę i sprawdź, czy pasek pokazuje oczekiwane opcje.
- Toolbar znika automatycznie, gdy w DOM nie ma `data-version-group`.
- Stan wyboru można wymusić linkiem: `?sv=hero:v2` pokazuje od razu wersję v2.
