# Block-First Architecture & Workflow

Ten dokument opisuje standard budowania uniwersalnych i skalowalnych komponentów ("Bloków") w naszym Starter Kicie. Zastępuje on podejście "Template-First" na rzecz elastycznego budowania z niezależnych klocków.

## 1. Filozofia: Separacja Struktury od Szlifu

Głównym celem Starter Kita jest możliwość szybkiego wdrażania unikalnych wizualnie stron dla klientów (Premium Look) bez konieczności przepisywania logiki i układu (Grid/Flex) za każdym razem. 

Aby to osiągnąć, każdy nowo powstający blok (np. Hero, Features, Testimonials) budujemy z myślą o **trzech warstwach abstrakcji**:

### Warstwa 1: Tailwind jako główny sposób stylizacji
Tailwind definiuje układ, responsywność, odstępy, rozmiary oraz większość jednorazowych decyzji wizualnych.
- **Dozwolone klasy Tailwind:** `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-full`, `items-center`, `justify-between`, klasy breakpointów i klasy tokenów projektu.
- **Zabronione klasy Tailwind:** hardcoded kolory spoza tokenów, przypadkowe wartości omijające system oraz powtarzane zestawy klas, które powinny być wspólnym komponentem.

### Warstwa 2: CSS tylko dla systemu i wyjątków
CSS służy do tokenów, wspólnych komponentów, pseudo-elementów i złożonych animacji. Nie jest domyślnym miejscem dla layoutu pojedynczego bloku.
- **Używamy istniejących klas systemowych:** `ui-bg-surface`, `ui-bg-page`, `ui-text-on-dark`, `ui-radius-lg`, `ui-elevation-soft`.
- **Nową klasę CSS dodajemy dopiero po sprawdzeniu, że Tailwind i istniejące komponenty nie wystarczają.**
- Dzięki temu kod bloku nie ulega zmianie, a blok automatycznie dostosowuje się do ostrego, technicznego motywu lub miękkiego, przyjaznego (zdefiniowanego w pliku `design/[klient].md`).

### Warstwa 3: "Szlif Premium" i Dekoracje (Astro Slots)
Wszystko, co nadaje "efekt wow" i jest w 100% unikalne dla danego wdrożenia klienta (np. szklane tła *glassmorphism*, kolorowe i rozmyte kule w tle, nietypowe wektory, specyficzne patterny graficzne).
- **Zasada:** Takich efektów **nie umieszczamy w kodzie bloku**. Zamiast tego każdy blok posiada dedykowany `<slot name="decorations" />` zlokalizowany w warstwie tła (`z-0`). 
- Dekoracje wstrzykujemy w czystym Tailwindzie dopiero w pliku składającym daną stronę widoczną dla klienta.

---

## 2. Architektura Katalogów

- **Atomy i Molekuły:** `src/components/ui/` (Fundamenty, absolutne minimum logiki).
- **Bloki (Organisms):** `src/components/registry/` (Złożone, ale uniwersalne sekcje, np. `HeroEditorialBlock.astro`, `HeroSplitBlock.astro`). To jest nasza biblioteka gotowych do użycia klocków.
- **Strony (Wdrożenie Klienta):** `src/pages/` (Tutaj wywołujemy bloki i wstrzykujemy "Szlif Premium").

---

## 3. Praktyczny Przykład

Poniżej znajduje się przykład rozdzielenia rdzenia bloku od jego ostylowania dla klienta (na bazie bloku błędów 404).

### Etap A: Definicja Bloku (Współdzielona struktura)
*Przykład użycia: strona klienta z blokiem `HeroEditorialBlock`*

```astro
---
interface Props { class?: string; }
const { class: className } = Astro.props;
---
<section class:list={["relative flex min-h-[100dvh] flex-col items-center justify-center ui-bg-page overflow-hidden", className]}>
	
    <!-- Warstwa 3 (Miejsce na szlif premium wstrzykiwany na stronie) -->
	<div class="absolute inset-0 pointer-events-none z-0">
		<slot name="decorations" />
	</div>

	<!-- Warstwa 1 i 2 (Układ w Tailwindzie + klasy semantyczne ui-*) -->
	<div class="ui-container relative z-10 text-center">
		<slot />
	</div>
</section>
```

### Etap B: Wykorzystanie na stronie klienta (Aplikowanie Szlifu)
*Plik: `src/pages/404.astro`*

```astro
<HeroEditorialBlock>
    <!-- Szlif Premium: wstrzykujemy unikalne dla tego klienta rozmyte tła -->
    <Fragment slot="decorations">
        <div class="absolute top-0 left-0 w-full h-full opacity-10">
            <div class="absolute -top-1/4 -left-1/4 w-[60%] bg-brand-primary rounded-full blur-[100px]"></div>
        </div>
    </Fragment>

    <!-- Treść składana z Atomów -->
    <Heading tag="h1" variant="section-title">Ups! Zgubiłeś się.</Heading>
    <Button href="/" variant="primary">Wróć</Button>
</HeroEditorialBlock>
```

---

## 4. Checklista Twórcy: Jak dodać nowy blok do Starter Kita?

1. [ ] **Myśl szkieletem:** Stwórz plik w `src/components/registry/`. Ułóż elementy używając samego Tailwinda (`flex`, `grid`, `gap`, paddingi). Upewnij się, że blok zwija się poprawnie na mobile i wygląda sensownie na desktopie.
2. [ ] **Usuń twarde kolory:** Zastąp `bg-white` i `text-gray-800` klasami `ui-bg-surface`, `ui-text-on-light` itp.
3. [ ] **Uodpornij na motywy:** Zaokrąglenia i cienie przepnij na klasy `ui-radius-md` i `ui-elevation-soft`.
4. [ ] **Dodaj gniazdo dekoracji:** Zawsze zaimplementuj ukryty `<slot name="decorations" />` jako element tła (upewnij się, że główna zawartość ma `position: relative` i wyższy `z-index`, aby nie dała się przykryć).
5. [ ] **Otestuj w izolacji:** Sprawdź blok z wyłączonymi dekoracjami. Powinien wyglądać czysto, czytelnie i w pełni poprawnie (choć może surowo). Jeśli tak jest – wykonałeś świetną robotę.
