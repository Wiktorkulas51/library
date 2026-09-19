# Znane bugi i problemy (KNOWN ISSUES)

Lista znanych, potencjalnie naprawionych problemów. Zanim zaczniesz debugować od zera, sprawdź tę listę. Każdy wpis zawiera: objaw, przyczynę, kroki diagnozy i rozwiązanie.

## Jak korzystać z tej listy

1. Masz objaw pasujący do wpisu? Wykonaj kroki z "Diagnoza", potem "Rozwiązanie".
2. Jeśli naprawiasz problem, którego tu nie ma, DOPISZ go na końcu (data, objaw, przyczyna, diagnoza, rozwiązanie).
3. Nie kasuj wpisów po naprawie: stary bug może wrócić, a objawy warto znać.

---

## [2026-08-01] Brakujące style / maski / animacje na produkcji (clean-dist kasuje scoped CSS)

**Objaw:** na produkcji znikają style, maski, animacje (np. float na 404), mimo że w dev wszystko działa. Dev server nie pokaże problemu.

**Przyczyna:** `src/scripts/clean-dist.mjs` (uruchamiany po `astro build`) usuwa pliki CSS z `@_@` w nazwie. To scoped style Astro (per komponent/strona, np. `404@_@astro.css`), a nie śmieci po usuniętych komponentach. Stary bug kasował WSZYSTKIE pliki `@_@`, także używane.

**Diagnoza (kolejno):**
1. Sprawdź `dist/assets/` czy plik `@_@` dla danej strony istnieje (np. `404@_@astro.css`).
2. W wygenerowanym HTML strony (np. `dist/404.html`) sprawdź, czy `<link rel="stylesheet">` wskazuje na ten plik i czy plik fizycznie jest na dysku.
3. Uruchom `npm run build` i zobacz log `clean-dist: usunieto X niepotrzebnych elementow`.

**Rozwiązanie:** skrypt skanuje wszystkie wygenerowane HTML za referencjami `/assets/*` i usuwa tylko pliki `@_@` bez żadnego odwołania. Jeśli mimo to plik znika, sprawdź czy referencja w HTML nie używa pełnego URL (np. `https://domena.pl/assets/...`) zamiast ścieżki względnej `/assets/...` (wtedy filtr jej nie widzi).

**Zasada na przyszłość:** `@_@` w nazwie pliku = scoped style Astro, MOŻE być używany. Usuwaj tylko pliki `@_@` bez referencji w HTML. Nie zmieniaj skryptu bez zachowania tej reguły.

---

## [2026-08-01] Warianty UI nie widać / nie ma przycisków przełączania (VersionToolbar)

**Objaw:** strona ma `data-version-group`, ale pasek na dole się nie pokazuje.

**Diagnoza (kolejno):**
1. Czy URL ma parametr `?vt=1`? Bez niego toolbar jest celowo ukryty, nawet jeśli w DOM są warianty.
2. Czy `VersionToolbar` jest zaimportowany w `src/layouts/Layout.astro`?
3. Czy w grupie są co najmniej 2 elementy `data-version`? Pasek nie pokazuje grup z jedną wersją.

**Rozwiązanie:** dodaj `?vt=1` do URL (demo: `/dev/demo/?vt=1`). Szczegóły atrybutów i workflow: `.docs/VERSION_TOOLBAR.md`.

**Zasada:** warianty są tymczasowe, po decyzji usuń wszystkie `data-version-group` i `data-version` z kodu.
