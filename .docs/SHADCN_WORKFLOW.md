# Architektura Kopiuj-Wklej (Podejście "Shadcn UI")

Ten dokument opisuje standard pracy z gotowymi blokami i danymi stron w Starter Kicie. Celem jest ponowne używanie sprawdzonych sekcji bez tworzenia osobnych systemów szablonowych.

## Główne Założenia

1. **Własność nad kodem:** Komponenty strukturalne (Bloki) są **punktami startowymi**, a nie zamkniętymi bibliotekami NPM. Masz pełne prawo je modyfikować na potrzeby konkretnego projektu.
2. **Zero Overengineeringu:** Jeśli modyfikacja bloku wymaga dodania skomplikowanych instrukcji warunkowych (`if`) do zmiany układu HTML, blok należy skopiować do szablonu (tzw. "Eject").

---

## 1. Źródło Prawdy (`src/components/registry/`)

Katalog rejestru to Twoja baza ("Twój osobisty Shadcn").
- Bloki znajdujące się tutaj mają wyglądać bardzo dobrze domyślnie (posiadają wbudowane `aspect-ratio`, zaokrąglenia, cienie oparte na `ui-*`).
- Bloki te mogą i powinny zawierać "domyślną zawartość" wewnątrz slotów dekoracyjnych.
- **Złota zasada:** Nie modyfikujesz tych plików pod konkretnego klienta. Służą one jako uniwersalny rdzeń dla wszystkich.

---

## 2. Workflow Pracy z Szablonami

Kiedy budujesz nową stronę dla klienta, pracujesz w `src/data/pages/`, `src/data/sections/` oraz `src/components/registry/`:

### Ścieżka A: Szybki import (Domyślny wygląd)
Jeżeli blok z `registry/` w 100% pasuje do wymagań klienta (np. potrzebujesz standardowego Call To Action), po prostu importujesz go i przekazujesz ewentualnie inną dekorację przez `<slot>`.

```astro
import CtaCenteredBlock from "@components/registry/CtaCenteredBlock.astro";

<CtaCenteredBlock>
  <!-- Tu możesz, ale nie musisz, nadpisać domyślną dekorację -->
</CtaCenteredBlock>
```

### Ścieżka B: "Eject" (Głęboka Customizacja)
Jeżeli klient wymaga, aby w `ContentSplitBlock` zdjęcie wykraczało poza kontener, miało nieregularny kształt od maski SVG i inną hierarchię tekstów:
**NIE DODAJESZ nowych propsów do pliku w `registry/`!**

Zamiast tego:
1. Kopiujesz plik `src/components/registry/ContentSplitBlock.astro`.
2. Jeśli nie ma odpowiedniego bloku, dodajesz go do `src/components/registry/` i rejestrujesz w `src/config/section-registry.ts`.
3. W tym nowym pliku rozbijasz HTML i piszesz go po swojemu, tnąc i zmieniając co tylko chcesz.

W oryginalnym rejestrze zostaje czysty kod, a Ty masz projekt klienta zrobiony perfekcyjnie na miarę.

---

## 3. Backporting (Zwrot do Rejestru)

Gdy podczas pracy nad klientem (ścieżka B) stworzysz absolutnie piękny wariant sekcji z funkcjami i uznasz, że chcesz go mieć na stałe w Starter Kicie:
Po prostu utrzymujesz blok w `src/components/registry/`, a treści przechowujesz w `src/data/sections/`.
Od tej pory jest on dostępny dla każdego nowego szablonu jako Ścieżka A.
