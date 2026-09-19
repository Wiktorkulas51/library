# AI Coding Standards & Anti-Patterns

This document defines strict rules for AI agents to maintain the integrity of the Atomic Design system and project architecture. **FOLLOW THESE RULES WITHOUT EXCEPTION.**

## 🚫 Banned UI Patterns (Anti-Patterns)

### 1. No "Fake Quotes"
- **NEVER** use `border-l-2`, `pl-8`, or similar utility classes on `<p>` or `Text` components to simulate a blockquote.
- **Why?** It creates inconsistent "one-off" styling.
- **Solution:** Use a dedicated `Quote` atom or molecule if needed, or stick to standard `Text` variants.

```astro
<!-- ZLE: udawany cytat przez utility klasy -->
<p class="border-l-2 pl-8 text-sm italic">Treść cytatu</p>

<!-- DOBRZE: naturalny przepływ tekstu -->
<Text variant="body">Treść cytatu</Text>
```

### 2. No "Generic Pill Badges"
- **NEVER** use the pattern: `rounded-full bg-brand-primary/10 text-brand-primary`.
- **Why?** It looks cheap and generic ("ugly badges").
- **Solution:** Use minimalist taglines: just uppercase text with high tracking (`tracking-[0.2em]`), maybe a small accent dot, or a very thin underline. Keep it premium.

```astro
<!-- ZLE: pill badge z brand bg -->
<span class="rounded-full bg-brand-primary/10 px-4 py-1 text-brand-primary">Nowość</span>

<!-- DOBRZE: minimalistyczny tagline -->
<span class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">Nowość</span>
```

### 3. No High-Contrast Background Jumps
- **NEVER** alternate sections with high-contrast backgrounds (e.g., White -> Dark Blue -> Brand Accent).
- **Why?** It breaks the visual flow and makes the site look disjointed.
- **Solution:** Stick to `ui-bg-page` for most sections. Use `ui-bg-base` (subtle off-white/gray) or thin borders (`border-b border-brand-dark/5`) for separation. High-contrast backgrounds are reserved ONLY for the Footer or very specific, single CTA blocks.

```astro
<!-- ZLE: skoki kontrastu -->
<section class="bg-white">...</section>
<section class="bg-blue-900 text-white">...</section>
<section class="bg-orange-500 text-white">...</section>

<!-- DOBRZE: płynne przejścia -->
<Section tone="page">...</Section>
<Section tone="base">...</Section>
<Section tone="page">...</Section>
```

### 4. No Direct Layout Classes on Atoms
- **NEVER** add `mt-10`, `mb-20`, or large paddings directly to `Heading` or `Text` inside layout files.
- **Why?** Spacing should be managed by the container or a parent "Molecule" (like `SectionHeader` or `ButtonGroup`).
- **Solution:** Wrap elements in a `div` or use the established spacing system.

```astro
<!-- ZLE: marginesy bezpośrednio na atomie -->
<Heading tag="h2" variant="section-title" class="mt-10 mb-5">Tytuł</Heading>
<Text variant="body" class="mb-8">Opis</Text>

<!-- DOBRZE: spacing na wrapperze -->
<div class="space-y-5">
  <Heading tag="h2" variant="section-title">Tytuł</Heading>
  <Text variant="body">Opis</Text>
</div>
```

### 5. No Hardcoded Colors
- **NEVER** use `text-[#333]` or `bg-blue-500`.
- **Solution:** Use project tokens: `text-brand-dark/60`, `ui-bg-page`, `text-brand-primary`, etc.

```astro
<!-- ZLE: hardcoded Tailwind color -->
<span class="text-blue-500">Tekst</span>
<div class="bg-gray-100">Tło</div>

<!-- DOBRZE: design tokeny -->
<span class="text-brand-primary">Tekst</span>
<div class="ui-bg-page">Tło</div>
```

### 6. No "Pulsing Accent Dots"
- **NEVER** use small pulsing circles (e.g., `animate-pulse h-2 w-2 rounded-full`).
- **Why?** They are distracting, feel "cheap," and are explicitly hated by the user ("nei nawidze czegos takiego").
- **Solution:** Use static accent dots if necessary, or better yet, avoid them entirely unless they represent a critical real-time status.

```astro
<!-- ZLE: pulsing dot -->
<span class="flex h-2 w-2 animate-pulse rounded-full bg-brand-primary"></span>

<!-- DOBRZE: statyczny akcent lub brak -->
<span class="inline-block h-2 w-2 rounded-full bg-brand-primary"></span>
```

### 7. No "Writing from Scratch" (Raw HTML)
- **NEVER** write raw `<section>`, `<p>`, `<h1-h6>`, or `<a>` with manual classes in template components.
- **WHY?** Bypasses the entire design system — brak themingu, brak spójności typograficznej, brak auto-reveal, spacing spoza systemu.
- **Solution:** Always use `Section.astro`, `Container.astro`, `Heading.astro`, `Text.astro`, `Button.astro`.

**Przykład:**
```astro
<!-- ZLE: raw HTML, brak design systemu -->
<section class="py-16 bg-white">
  <h2 class="text-3xl font-bold">Tytuł</h2>
  <p class="text-gray-600">Opis</p>
</section>

<!-- DOBRZE: atomic components + tokeny -->
<Section tone="page">
  <Container>
    <Heading tag="h2" variant="section-title">Tytuł</Heading>
    <Text variant="body">Opis</Text>
  </Container>
</Section>
```

### 8. No "Global 44px" on `<a>` Tags
- **NEVER** add `min-height: 44px` or `min-width: 44px` globally to `<a>` elements.
- **WHY?** It breaks navbar layout, stretches inline links, and causes cascading fixes across every project. The 44px WCAG touch target rule applies to interactive controls (`<button>`), not to every link on the page.
- **Solution:** The global `button, a { min-height: 44px }` rule was removed from `src/styles/foundations.css`. Only `<button>` keeps it. If a specific link needs a larger touch target, size it individually (e.g., `min-h-11` on that single element), never globally.

## 🏗️ Architecture Mandates

### 1. Atomic Supremacy
- Every piece of text **MUST** be rendered using `src/components/ui/atoms/Text.astro` or `Heading.astro`.
- Every section **MUST** use `src/components/ui/layout/Section.astro`.

### 2. Mobile-First
- Always write base Tailwind classes for mobile, then use `md:` or `lg:` for desktop.
- Default to `clamp()` for fluid sizes instead of fixed `px`.

### 3. Studio Compatibility
- Ensure all blocks are registered in the `Studio` and use URL parameters for state persistence.
- Blocks must handle `theme="dark"` and `theme="light"` variants using CSS variables.

### 4. ABSOLUTNY NAKAZ: Cazy tekst w JSON
- **Zadna linijka tekstu** nie moze byc hardcoded w `.astro`, `.tsx`, `.ts` ani `.css`.
- Kazdy napis, naglowek, opis, labelka, tagline, button, alt, placeholder, tooltip, error message, stopka, kontakt, stopka link — **WSZYSTKO** w `src/data/`.
- Komponenty (`atoms/`, `molecules/` i `registry/`) nie mogą zawierać **żadnego** widocznego tekstu. Tylko `{data.field}` lub `{content.field}`.
- Struktura: `src/data/sections/*.json` dla treści sekcji, `src/data/pages/*.json` dla konfiguracji stron, `src/data/global/*.json` dla elementów globalnych (navbar, footer, kontakt).
- **Zero wyjatkow.** Nawet placeholdery, "Lorem ipsum", domyslne etykiety — w JSON.
- **Kontrola:** `rg ">[A-Za-z]" src/components/` — jesli cos wyswietli, to blad.

---

## 🎯 Tailwind first, CSS jako ostateczność

Tailwind jest podstawowym sposobem stylizacji komponentów i bloków. Nową klasę CSS dopisuj dopiero wtedy, gdy istniejące utility, tokeny lub komponenty nie rozwiązują problemu w czytelny sposób.

### Najpierw Tailwind (w klasach HTML/Astro):
- **Layout jednorazowy**: flex, grid, gap, padding, margin dla konkretnego bloku
- **Responsywność**: `md:`, `lg:` breakpointy dla konkretnego elementu
- **Proste stany**: `hover:`, `focus:` dla pojedynczych elementów (np. karta, link)
- **Rozmiary**: width, height, max-w dla konkretnego komponentu
- **Kolory**: uzywaj TYLKO tokenów (`text-brand-primary`, `bg-brand-dark/10`)
- **Odstępy**: spacing per-element (np. `gap-4`, `p-6`, `mt-8`)
- **Stan pojedynczego elementu**: `hidden`, `opacity-0`, `translate-x-full`

```astro
<!-- DOBRZE: Tailwind dla layoutu bloku -->
<section class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  <div class="rounded-2xl p-6 hover:shadow-lg transition-shadow">...</div>
</section>
```

### CSS tylko jako wyjątek:
- **Istniejący system globalny**: Button, Card, Form i Nav, gdy reguła musi działać w wielu miejscach.
- **Powtarzalny pattern**: ten sam styl używany w co najmniej 3 miejscach i nie da się go czytelnie wyrazić istniejącymi utility.
- **Pseudo-elementy**: `::before` i `::after`, jeśli nie można użyć istniejącego komponentu.
- **Złożone animacje**: keyframes albo przejścia z wieloma właściwościami.
- **Warianty motywu**: reguły zależne od `data-theme`.
- **Tokeny i fundamenty**: zmienne CSS, reset, typografia systemowa i globalne utility.

Nowy komponent nie powinien otrzymywać osobnego pliku CSS tylko dlatego, że ma własny layout. Najpierw użyj klas Tailwind. Jeśli CSS jest konieczny, umieść go w odpowiednim pliku `src/styles/` albo jako scoped style komponentu, gdy reguła dotyczy wyłącznie tego komponentu.

```css
/* DOBRZE: CSS dla systemu */
.ui-card-testimonial {
  @apply flex flex-col justify-between h-full p-8 shadow-sm rounded-2xl;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.ui-card-testimonial:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15);
}
```

### Globalne style systemowe:
- **CSS custom properties**: design tokeny (`--color-brand-primary`, `--spacing-*`)
- **Reset/i base**: html, body, `::selection`, `scroll-behavior`
- **Typografia systemowa**: `.ui-type-heading-hero`, `.ui-type-body` itp.
- **Utility globalne**: `.ui-container`, `.ui-section`, `.reveal`, `.ui-bg-page`
- **Klasy `.ui-*`**: tylko wtedy, gdy są częścią wspólnego systemu używanego w wielu miejscach, a nie jako nazwa jednorazowego układu.

### Dekalog Tailwind:
1. **TAK** używaj Tailwind jako domyślnego sposobu stylizacji
2. **NIE** twórz CSS dla jednorazowego layoutu, jeśli wystarczą utility
3. **NIE** używaj `@apply` w komponentach, to jest do plików systemowych w `src/styles/`
4. **NIE** powtarzaj złożonych efektów hover; użyj istniejącego utility albo wspólnego komponentu
5. **TAK** uzyj Tailwind do jednorazowego layoutu sekcji
6. **TAK** uzywaj tokenow zamiast hardcoded wartosci
7. **TAK** uzywaj `md:`, `lg:` dla responsywnosci per-element
8. **TAK** uzywaj `clamp()` zamiast `text-2xl lg:text-4xl` dla fontow
9. **TAK** grupuj powtarzalne patterny w odpowiednim pliku `src/styles/` jako `.ui-*`, gdy są rzeczywiście wspólnym systemem
10. **NIE** dodawaj nowej klasy `.ui-*` tylko po to, aby ukryć jednorazowy układ

## 🧬 Page Builder — Generative Workflow (OBOWIĄZKOWE)

### AI: Jak szybko tworzyć strony dla klienta

1. **Klient podaje wymagania** (sekcje, treść, vibe)
2. **AI analizuje** i mapuje na sekcje z `src/config/section-registry.ts`
3. **AI wybiera warianty** dla każdej sekcji, kierując się hintami i typem treści
4. **AI tworzy** `src/data/pages/[slug].json` z odpowiednią kolejnością sekcji
5. **AI uzupełnia** `src/data/sections/*.json` jeśli potrzeba (tylko treść, nie struktura)
6. **Jeśli brak bloku** w registry → AI tworzy nowy Registry Block w `src/components/registry/`, dodaje manifest oraz wariant w domenowym module section registry

### Page Config Format
```json
{
  "seo": {
    "title": "Home | Firma",
    "description": "Opis strony"
  },
  "sections": [
    { "id": "navbar", "variant": "floating" },
    { "id": "hero", "variant": "service" },
    { "id": "features", "variant": "grid" },
    { "id": "footer", "variant": "columns" }
  ]
}
```

### Sekcje dostępne w registry (z COMPONENTS.md)
AI musi znać aktualne wpisy registry. Przed wyborem sekcji sprawdź:
- `src/config/section-registry.ts` — lista sekcji + wariantów
- `src/data/sections/*.json` — dostępne dane
- `src/components/registry/` — istniejące bloki

### Zasady wyboru wariantów
- **Hero**: `service` → usługi B2B, `conversion` → landing page, `showcase` → portfolio
- **Features**: `grid` → przegląd, `list` → szczegółowe, `zigzag` → storytelling
- **Testimonials**: `grid` → klasycznie, `carousel` → oszczędność miejsca, `marquee` → wow effect
- **CTA**: `centered` → prosto, `banner` → subtelnie, `banner-split` → z obrazem
- **Gdy nie wiesz → defaultVariant** z registry (jest bezpieczny)

## 🧪 Atomic Design Checker

### 7. Run `npm run check:atomic` after creating/modifying components
- **Zawsze** po dodaniu lub zmianie komponentu uruchom `npm run check:atomic`.

### 8. Prefer path aliases over relative imports
- Używaj aliasów (`@components/`, `@utils/`, `@data/`, `@config/` itd.) zamiast relatywnych `../`.
- Wyjątek: importy w obrębie tego samego katalogu (`./`) są OK.
- Sprawdź: `npm run check:imports`.
- Sprawdza hierarchię importów (atomy → tylko atomy, molekuły → atomy/layouty, registry → atomy/molekuły/layouty).
- Wykrywa zakazane wzorce: pill badges, hardcoded kolory, pulsing dots, fake quotes.
- Wykrywa surowe `<p>` / `<h1-h6>` (powinny być `Text.astro` / `Heading.astro`).
- Wykrywa marginesy (mt-/mb-) w atomach.
- **Nie pomijaj** — napraw naruszenia przed oddaniem kodu.

### 9. OBOWIAZKOWA rejestracja nowych blokow registry
- Po utworzeniu nowego pliku `.astro` w `src/components/registry/` **MUSISZ**:
  1. Dodać wpis w `src/config/component-manifest.ts`
  2. Dodać wariant w odpowiednim module `src/config/section-registry/`
  3. Dodać dane sekcji w `src/data/sections/[id].json`, jeśli blok używa `dataKey`
- Przed oddaniem kodu uruchom: `npm run check:registrations`
- **NIE pomijaj** tego kroku. Brak rejestracji = blok nie istnieje na stronie.

### 10. Animacje i przejścia

Pełny podział animacji dozwolonych, warunkowych i zakazanych znajduje się w
`.docs/ANIMATIONS.md`. Ten rozdział opisuje najważniejszy antywzorzec, który
trzeba sprawdzić przy każdej animacji lokalnej.

- **NIGDY** nie uzywaj `animation-fill-mode: both` ani `animation-fill-mode: forwards` na tej samej wlasciwosci co `transition`.
- **DLACZEGO?** CSS Animation (nawet po zakonczeniu przez `animation-fill-mode: both`) przejmuje kontrole nad wlasciwoscia i blokuje CSS Transition na tej samej wlasciwosci. Przy hover przestaje dzialac `transform`, `box-shadow`, `opacity` itp.
- **Rozwiazanie:** Uzywaj `transition` zamiast `@keyframes` dla efektow wejscia. Jesli juz musisz uzyc `@keyframes`, nie ustawiaj `animation-fill-mode` lub uzyj `animation-fill-mode: none` i zadbaj o docelowy stan w klasie.
- **Jesli animacja jest niezbedna:** po `animationend` usun ja z elementu (`el.style.animation = 'none'`) albo opisz ja jako wyjatek komponentu w `.docs/ANIMATIONS.md`.

```astro
<!-- ZLE: @keyframes + fill-mode blokuje transition na hover -->
<style>
  @keyframes service-enter {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card {
    animation: service-enter 0.6s ease both;
    transition: transform 0.3s ease; /* ← NIE DZIALA PRZEZ animation-fill-mode */
  }
  .card:hover { transform: translateY(-4px); }
</style>

<!-- DOBRZE: sam transition zamiast @keyframes -->
<style>
  .card {
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
    opacity: 0;
    transform: translateY(30px);
  }
  .card.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .card:hover {
    transform: translateY(-4px);
  }
</style>

<!-- DOBRZE: @keyframes + cleanup po animationend -->
<style>
  @keyframes service-enter {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card { animation: service-enter 0.6s ease both; }
  .card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
</style>
<div class="card" data-animation-once>...</div>
```
- **Kontrola:** `npm run check:atomic` wykrywa `animation-fill-mode: both/forwards` w kazdym pliku.

### 11. Skrypty inicjalizacyjne a nawigacja SPA (data-astro-rerun / astro:page-load)

**Problem:** Astro ClientRouter (View Transitions) nie re-uruchamia skryptów przy przejściu
między podstronami. Skrypt inicjalizujący (obserwator, listenery na elementy, stan) wykonany
raz przy pierwszym loadzie zostaje bezsensowny na każdej kolejnej stronie: sekcja zostaje
zamrożona (np. timeline bez paska postępu, FAQ bez animacji, quiz bez logiki).

**Reguła:** KAŻDY skrypt z inicjalizacją MUSI dostać jedno z dwóch zabezpieczeń:

1. **Preferowany: własny nasłuch `astro:page-load` w skrypcie** — skrypt ładuje się raz,
   a re-inicjalizacja dzieje się w handlerze (wzorzec z `motion.js`, `lightbox.js`,
   `CalculatorBlock`, `RoomDetailBlock`).
2. **Dopuszczenie: `data-astro-rerun` na `<script is:inline ...>`** — dla prostych skryptów
   z `public/js` bez logiki stanu w środku (wzorzec z `navbar.js`, `accordion.js`).

```astro
<!-- ZLE: skrypt bez re-init - po nawigacji SPA nie zadziała -->
<script is:inline src="/js/my-widget.js"></script>

<!-- DOBRZE (opcja 1): re-init przez astro:page-load -->
<script>
  function init() { /* observer, listenery... */ }
  document.addEventListener('astro:page-load', init);
  init();
</script>

<!-- DOBRZE (opcja 2): data-astro-rerun na skrypcie z public/js -->
<script is:inline data-astro-rerun src="/js/my-widget.js"></script>
```

**Czego NIE dostaje re-init (świadome wyłączenia):**
- Skrypty globalne one-shot (nasłuch eventów na `document`: `toast.js`, `cookie-consent.js`)
  — re-run by zduplikował listenery i zepsuł działanie.
- Biblioteki (`lenis-lib.min.js`).

**Reguła przy tworzeniu komponentu z `<script is:inline>`:**
pomyśl, czy skrypt ma stan zależny od DOM. Jeśli tak, wybierz jedną z dwóch opcji powyżej
i dopisz krótki komentarz *dlaczego* (przykład w `ProcessTimelineScrollBlock.astro`).

## 🧹 Cleanup Checklist
- Remove `console.log` and `debugger` before finishing.
- Ensure no "debug" borders or backgrounds are left in the code.
- Verify `data-theme` compatibility (check if colors adapt).
