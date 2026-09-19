# Contributing

To repozytorium jest standalone biblioteką komponentów UI. Instrukcje dla agentów znajdują się w `AGENTS.md`.

## Start

1. Użyj Node.js zgodnego z `package.json`, obecnie minimum `22.12.0`.
2. Uruchom `npm ci` oraz `npm run dev`.
3. Otwórz `/`, następnie wybrany podgląd pod `/components/`.
4. Przed zmianą sprawdź `git status --short` i istniejące warianty w `src/components/registry/`.

## Zasady architektury

- Biblioteka przechowuje prezentację komponentów, nie logikę stron klientów.
- Reuse istniejące atomy, molekuły, tokeny i wzorce przed dodaniem nowego kodu.
- Dane wariantów trzymaj poza komponentem Astro, jeśli istnieje dla nich kontrakt danych.
- Każdy wariant musi być możliwy do otwarcia w galerii i podglądzie.
- Nie dodawaj nowych tras deweloperskich pod `/dev/`. Używaj tras kanonicznych.

## Weryfikacja

Po zmianie uruchom:

```powershell
npm run check:types
npm run test -- --run
npm run build
npm run check:build-output
```

Zmiany UI sprawdź również ręcznie w `/` i na odpowiednim podglądzie, w widoku mobilnym oraz desktopowym.

## Git

Sprawdzaj diff przed zatwierdzeniem i stage'uj wyłącznie pliki związane z zadaniem. Nie resetuj ani nie usuwaj nierozpoznanych zmian.
