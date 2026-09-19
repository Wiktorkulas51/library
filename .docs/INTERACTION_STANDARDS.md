# Standard interakcji galerii i lightboxa

Ten dokument opisuje wspólny wzorzec dla galerii zdjęć w starterkicie. Ma zapobiegać regresjom, w których klient może otworzyć zdjęcie, ale nie może przejść do kolejnego bez zamykania podglądu.

## Kontrakt komponentów

`src/components/ui/molecules/ImageLightbox.astro` renderuje jeden globalny modal dla całej strony. Logika znajduje się w `public/js/lightbox.js`.

Pojedyncze zdjęcie może używać:

```html
<div data-lightbox data-href="/assets/images/zdjecie.webp" data-title="Opis zdjęcia">
```

Galeria z nawigacją musi przekazać pełną listę zdjęć w `data-lightbox-gallery`:

```html
<div
  data-lightbox
  data-href="/assets/images/zdjecie-01.webp"
  data-title="Pierwsze zdjęcie"
  data-lightbox-gallery='[{"src":"/assets/images/zdjecie-01.webp","title":"Pierwsze zdjęcie"},{"src":"/assets/images/zdjecie-02.webp","title":"Drugie zdjęcie"}]'
>
```

`GalleryBlock.astro` tworzy ten atrybut automatycznie na podstawie danych JSON. Przy tworzeniu nowego bloku galerii należy użyć tego samego kontraktu zamiast pisać osobny lightbox.

Komponenty renderujące wiele osobnych kafelków mogą zamiast powielania JSON użyć `data-lightbox-group` na wspólnym kontenerze. Skrypt zbierze widoczne elementy z `data-lightbox` i pominie elementy ukryte przez filtr:

```astro
<div data-lightbox-group>
  <div data-lightbox data-href={image.src} data-title={image.alt}></div>
</div>
```

`PortfolioCategorizedBlock.astro` korzysta z tego mechanizmu domyślnie, dlatego strzałki działają również po wybraniu kategorii.

## Zachowanie na urządzeniach

- Na desktopie strzałki są po bokach zdjęcia.
- Na telefonie widoczne kółka mają 32 piksele, a strzałki znajdują się pod zdjęciem.
- Każdy przycisk zachowuje obszar kliknięcia minimum 44 na 44 piksele zgodnie z globalnym stylem `button` w `src/styles/core.css`.
- Przycisk zamknięcia jest odsunięty nad zdjęcie na telefonie.
- Działa kliknięcie strzałek, klawisze `ArrowLeft` i `ArrowRight` oraz `Escape`.
- Dla pojedynczego zdjęcia strzałki są ukryte.

Nie zmniejszaj przycisków poniżej 44 pikseli przez usuwanie globalnego minimum. Jeśli widoczne kółko jest za duże, zmniejsz wewnętrzny element wizualny, pozostawiając większy obszar dotyku.

## Cache skryptu

Skrypty z `public/js/` są kopiowane do buildu jako pliki statyczne i mogą być przechowywane w cache przez kilka dni. Po zmianie logiki skryptu trzeba zwiększyć wersję w komponencie:

```astro
<script is:inline src="/js/lightbox.js?v=2" defer></script>
```

Bez zmiany wersji część użytkowników może nadal ładować starą wersję pliku, nawet jeśli deploy zakończył się poprawnie.

## Weryfikacja przed deployem

Po zmianie galerii uruchom:

```powershell
npm run qa
npm run build
```

Następnie sprawdź ręcznie szerokości 320, 375, 390, 414 i 1440 pikseli:

1. Otwórz główne zdjęcie.
2. Sprawdź, czy nawigacja zmienia zdjęcie bez zamykania modala.
3. Sprawdź pierwszy i ostatni element galerii.
4. Sprawdź klawisze strzałek oraz `Escape`.
5. Sprawdź, czy przyciski nie nachodzą na ważną część zdjęcia.
6. Po deployu otwórz stronę w nowej sesji albo wymuś nowy adres skryptu z aktualnym parametrem wersji.
