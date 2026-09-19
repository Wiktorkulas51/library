---
title: Lighthouse CLI workflow dla AI
tags: [lighthouse, performance, accessibility, seo, ai, qa]
type: concept
date: 2026-08-06
---

# Lighthouse CLI workflow dla AI

Ten plik jest instrukcją dla agenta AI wykonującego audyt jakości Starter Kit. Należy go przeczytać przed uruchomieniem Lighthouse albo przed poprawianiem problemów Performance, Accessibility, Best Practices i SEO.

## Kiedy uruchomić audyt

Uruchom Lighthouse, gdy:

- zmieniono layout, hero, obrazy, fonty, JavaScript albo CSS;
- dodano lub usunięto stronę albo globalny komponent;
- zakończono większy refaktor wydajności;
- trzeba potwierdzić próg jakości dla nowego projektu ze Starter Kit;
- użytkownik pyta o Lighthouse, Core Web Vitals albo szybkość strony.

Nie traktuj samego wyniku Lighthouse jako dowodu jakości. Raport laboratoryjny trzeba połączyć z buildem, testami, inspekcją `dist` i, gdy jest dostępna, kontrolą strony w przeglądarce.

## Procedura

1. Uruchom `npm run qa:help`.
2. Dla lokalnego audytu uruchom jedną komendę:

```bash
npm run audit:lighthouse
```

Skrypt uruchamia `npm run build`, startuje `astro preview` na `http://127.0.0.1:4322/` i dopiero wtedy wykonuje pomiar. Lighthouse nie może być uruchamiany na `npm run dev`, ponieważ dev server nie reprezentuje artefaktu produkcyjnego z `dist/`.

Jeżeli audyt dotyczy już opublikowanej wersji, przekaż adres produkcyjny:

```bash
npm run audit:lighthouse -- --url https://example.com/
```

Lokalne adresy `localhost` i `127.0.0.1` są odrzucane jako parametr `--url`, aby przypadkowo nie zmierzyć wersji developerskiej.

3. Odczytaj najnowsze pliki `lighthouse-*.report.json` w `audit-reports/`. Plik HTML służy do ręcznego podglądu, a JSON jest źródłem danych dla AI.
4. Zapisz wynik początkowy dla obu profili. Nie poprawiaj kodu przed zapisaniem baseline.
5. Wybierz maksymalnie trzy najważniejsze problemy według wpływu na LCP, INP, CLS, transfer i dostępność.
6. Zlokalizuj źródło problemu w kodzie. Nie poprawiaj tylko wygenerowanego `dist`.
7. Wprowadź minimalną zmianę, uruchom odpowiednie testy i zbuduj projekt ponownie.
8. Uruchom Lighthouse drugi raz i porównaj wyniki z baseline.
9. Uznaj zmianę za poprawną tylko wtedy, gdy poprawa nie pogorszyła pozostałych kategorii ani layoutu mobilnego.

## Jak czytać JSON

Najpierw sprawdź:

- `categories.performance.score`
- `categories.accessibility.score`
- `categories['best-practices'].score`
- `categories.seo.score`
- `audits['largest-contentful-paint']`
- `audits['cumulative-layout-shift']`
- `audits['total-blocking-time']`
- `audits['interaction-to-next-paint']`, jeżeli jest dostępny w danej wersji Lighthouse

Następnie przejrzyj audyty z wynikiem poniżej 1 oraz audyty typu `numeric` z realną oszczędnością. Pomijaj audyty informacyjne, które nie wskazują działania naprawczego.

## Kolejność napraw

1. Błędy blokujące renderowanie albo niedziałającą stronę.
2. LCP, w szczególności obraz LCP, font LCP, TTFB i zasoby blokujące.
3. CLS, w szczególności brakujące `width` i `height`, font swap oraz elementy dynamiczne.
4. INP i TBT, w szczególności niepotrzebny JavaScript, długie zadania i event listenery.
5. Obrazy, `srcset`, `sizes`, AVIF, WebP i lazy loading.
6. Fonty, CSS krytyczny i nieużywane zasoby.
7. Accessibility, Best Practices i SEO.

## Zasady bezpiecznej naprawy

- Nie usuwaj funkcji tylko po to, aby podnieść wynik.
- Nie dodawaj preloadu wielu obrazów. Preload dotyczy tylko rzeczywistego zasobu LCP.
- Nie ustawiaj `loading="eager"` dla całej galerii.
- Nie zmieniaj `width` i `height` bez zachowania proporcji obrazu.
- Nie ukrywaj problemu przez wyłączenie audytu.
- Nie uznawaj wyniku 100 za ważniejszy niż działanie strony i dostępność.
- Po zmianie UI uruchom także `npm run check:mobile` oraz właściwe testy Vitest.
- Jeżeli problem dotyczy obrazu, przeczytaj również `.docs/IMAGE_PERFORMANCE.md`.

## Raportowanie wyniku

W podsumowaniu agenta podaj:

- URL i profil, mobile albo desktop;
- datę i wersję Lighthouse;
- wyniki czterech kategorii przed i po zmianie;
- wartości LCP, CLS, TBT oraz INP, jeśli są dostępne;
- poprawione pliki;
- problemy pozostawione bez zmian i powód;
- uruchomione testy i build.

Lighthouse CLI jest narzędziem laboratoryjnym. Wynik może się zmieniać między uruchomieniami, dlatego porównuj kilka pomiarów i opisuj warunki testu. Dane rzeczywistych użytkowników oraz Chrome DevTools Performance mogą ujawnić problemy, których pojedynczy raport CLI nie pokaże.
