# Starwind UI, status projektu

Ten plik zachowuje kontekst historyczny. W aktualnym Starter Kicie nie ma katalogu `src/components/starwind/`, dlatego nie należy importować komponentów z tej ścieżki ani traktować jej jako części bieżącej architektury.

## Aktualny standard

Przed dodaniem zewnętrznej biblioteki sprawdź komponenty lokalne:

- Astro atoms: `src/components/ui/atoms/`
- Astro molecules: `src/components/ui/molecules/`
- Astro layout: `src/components/ui/layout/`
- React UI: `src/components/ui/*.tsx`
- PageBuilder blocks: `src/components/registry/`

Jeżeli potrzebny wzorzec nie istnieje lokalnie, opisz decyzję architektoniczną i sprawdź wpływ na bundle, dostępność, stylowanie oraz build. Instalacja Starwind nie jest obecnie częścią standardowego workflow.

## Jak czytać starsze dokumenty

Starsze plany mogą zawierać importy `@/components/starwind/...`. Są to przykłady historyczne i nie wskazują aktualnych plików. Dla bieżącej pracy obowiązują `src/components/ui/`, `src/components/registry/` oraz `src/config/section-registry.ts`.

## Oficjalna dokumentacja

- [Starwind UI](https://starwind.dev/docs/components/)
- [Pełny reference dla AI](https://starwind.dev/llms-full.txt)
