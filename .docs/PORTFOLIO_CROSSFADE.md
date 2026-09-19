# PortfolioCategorizedBlock — crossfade obrazów

## Gdzie występuje

`src/components/registry/PortfolioCategorizedBlock.astro` — funkcja `setImage()`.

Ten komponent ma wariant z galerią zdjęć z dynamicznym przełączaniem (w przeciwieństwie do wariantów static/bento/marquee). Zdjęcia ładują się z folderów w `public/assets/images/`, a thumbnail z `public/assets/image-derivatives/thumbs/`.

## Architektura crossfade

Dwie warstwy `<img>` wewnątrz `[data-image-stage]`:
- `[data-image-prev]` — stary obraz, `z-index: 10` (na wierzchu)
- `[data-main-image]` — nowy obraz, brak z-index (pod spodem)

## Dlaczego był biały błysk

### 1. Obie warstwy przejrzyste jednocześnie

Początkowa wersja ustawiała obie warstwy na opacity < 1 w tym samym momencie:
- `main` opacity 0→1
- `prev` opacity 1→0

W środkowym punkcie animacji (t=300ms przy 600ms duration) mamy:
- `prev` przy opacity 0.5 na wierzchu
- `main` przy opacity 0.5 pod spodem

Ponieważ `prev` (z-index 10) blokuje tylko 50% światła, reszta przechodzi przez `main` (50% z 50% = 25%) do tła. W efekcie 25% widoku w środku crossfade to tło kontenera (`bg-white`). To jest biały błysk.

**Fix:** `main` (nowy obraz) ma stale `opacity: 1`. Tylko `prev` zmienia opacity (1→0). Wtedy tło nigdy nie prześwituje, bo pod `prev` zawsze jest `main` w 100% kryciu.

### 2. Guard przed podwójnym `doCrossfade`

`prev.setAttribute("src", src)` + `if (prev.complete) doCrossfade()` + asynchroniczny `prev.onload` mogą odpalić `doCrossfade` dwa razy (raz z `complete`, raz z `onload`). Każde uruchomienie tworzy osobny `new Image()` preloader i osobny `setTimeout`, efektem są dwa crossfade jeden po drugim.

**Fix:** zmienna `crossfadeStarted` i sprawdzanie na wejściu `doCrossfade`.

### 3. Restart `slide-in` po crossfadzie

Animacja `slide-in` na `[data-image-stage]` ma `animation-fill-mode: both` i `from { opacity: 0 }`. Restartowanie jej po zakończeniu crossfade (w `setTimeout`) robiło cały stage na chwilę przezroczystym (opacity 0 na rodzicu = obie warstwy dzieci niewidoczne).

**Fix:** `slide-in` odpala się tylko raz przy starcie strony (w `applyImage` z `skipFade: true`). Nie jest restartowany przy kolejnych zmianach zdjęć.

## Sekwencja crossfade (krok po kroku)

```
1. prev.src = oldSrc          — prev zaczyna ładować STARY obraz
2. doCrossfade()              — czeka na decode prev (onload/complete)
   3. new Image()             — preload NOWEGO obrazu
   4. preloader.onload:
      5. Wyłącz transicje     — prev.transition = "none", img.transition = "none"
      6. prev.opacity = "1"   — prev (stary) widoczny na wierzchu
      7. img.opacity = "1"    — main (nowy) widoczny POD prev
      8. img.src = nowySrc    — main dostaje nowy obraz (zakryty przez prev)
      9. Wymuś reflow         — void prev.offsetWidth
      10. Włącz transicje     — przywróć oryginalne transition
      11. Restart ken-zoom    — tylko na main
      12. prev.opacity = "0"  — TYLKO to jest animowane (600ms)
      13. setTimeout(650ms)   — cleanup: usuń src z prev, zaktualizuj UI
```

## Kluczowe elementy HTML

```html
<div data-image-stage style="background-color: #f4f8fc">
  <img data-image-prev class="absolute inset-0 ... opacity-0 ... z-10" />
  <img data-main-image class="absolute inset-0 ... opacity-1 ..." />
</div>
```

- `data-image-prev` ma `z-index: 10` aby być NAD main
- `data-image-stage` ma `background-color` w kolorze tła strony jako fallback
- Obie warstwy `absolute inset-0` z `object-cover` dla pełnego pokrycia

## CSS / animacje

```css
@keyframes ken-zoom {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
[data-main-image].ken-zoom {
  animation: ken-zoom 5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes slide-in {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
[data-image-stage].slide-in {
  animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

## Czego NIE robić

- Nie ustawiaj `img.opacity = "0"` na czas crossfade — tło prześwituje
- Nie restartuj `slide-in` przy każdej zmianie — `opacity: 0` w keyframe robi flash
- Nie ufaj `prev.complete` jako jedynemu strażnikowi — `onload` też odpali
- Nie używaj `transition: all` — tylko konkretnie `transition: opacity, transform`
- Nie pomijaj `void element.offsetWidth` między `classList.remove()` a `classList.add()` — bez forced reflow przeglądarka batchuje zmiany i animacja CSS się nie restartuje (błąd losowo działającego ken-zoom)
- Nie usuwaj `style="background-color: ..."` z `data-image-stage` — to fallback gdyby coś poszło nie tak

## Ken Burns zoom — restart animacji

Restart `@keyframes` wymaga forced reflow między usunięciem a dodaniem klasy:

```javascript
img.classList.remove("ken-zoom");
void img.offsetWidth;           // <-- to jest kluczowe
img.classList.add("ken-zoom");
```

Bez `void img.offsetWidth` przeglądarka nie widzi zmiany i animacja nie restartuje się (działa tylko przy pierwszym załadowaniu strony). Efekt: zoom czasami działa, czasami nie — zależnie od tego czy między remove a add zdarzy się przypadkowy reflow z innej operacji.
