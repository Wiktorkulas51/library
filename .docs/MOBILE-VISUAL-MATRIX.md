# Obowiązkowa macierz wizualnej weryfikacji

Ta macierz jest częścią lokalnego QA biblioteki. Każdy nowy layout, wariant sekcji i zmiana breakpointu należy sprawdzić przy wszystkich poniższych szerokościach.

| Szerokość viewportu | Cel kontroli |
| ---: | --- |
| 320 px | najmniejszy wspierany telefon, brak poziomego overflow |
| 375 px | typowy telefon, drawer i CTA |
| 390 px | większy telefon, łamanie nagłówków |
| 414 px | szeroki telefon, karty i formularze |
| 768 px | granica tabletowa, przejście z mobile |
| 834 px | tablet poziomy i warianty registry |
| 1024 px | mały desktop, navbar i kolumny |
| 1280 px | standardowy desktop |
| 1366 px | popularny laptop |
| 1440 px | szeroki desktop |
| 1920 px | maksymalna szerokość, ograniczenie treści |

## Checklista

- brak poziomego overflow i przypadkowego scrollbara
- navbar desktopowy i drawer mobilny mają poprawny stan
- nagłówki, teksty, karty i przyciski nie wychodzą poza kontener
- CTA i formularze pozostają dostępne z klawiatury
- obrazy zachowują proporcje i nie powodują skoku layoutu
- sekcje registry z długimi danymi nie rozpychają viewportu
- anchor przewija element pod stały nagłówek
- warianty light i dark nie tracą kontrastu

## Lokalna procedura

1. Uruchom `npm run dev`.
2. Otwórz stronę lub fixture QA w przeglądarce.
3. Ustaw kolejno każdą szerokość z tabeli.
4. Zapisz wynik w komentarzu do zadania albo w raporcie QA.
5. Przy regresji zatrzymaj wdrożenie i dodaj test kontraktowy lub fixture reprodukujący problem.
