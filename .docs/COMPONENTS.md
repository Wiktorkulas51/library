# 🧩 Project Components Map

This document provides a comprehensive overview of all UI components available in the project, categorized by **Atomic Design** principles. Use this as a reference when building new pages or refactoring existing ones.

---

## 🎨 Decorative Components
*Ambient, non-interactive visual elements used to enhance sections, cards, and backgrounds. Inject via `slot="decorations"` in registry blocks, or place directly inside a `position: relative` container.*

| Component | Path | Description | Key Props |
| :--- | :--- | :--- | :--- |
| **GradientOrb** | `src/components/decorations/GradientOrb.astro` | Gradient blur orb — background atmosphere. | `position`, `color`, `size`, `blur`, `opacity` |
| **BeamLines** | `src/components/decorations/BeamLines.astro` | Cienkie linie do technicznych i editorialowych teł. | `color`, `opacity`, `angle`, `spacing` |
| **GridPattern** | `src/components/decorations/GridPattern.astro` | Tokenowa siatka do spokojnych teł, blueprintów i sekcji technicznych. | `color`, `size`, `opacity`, `fade` |
| **BlurGlow** | `src/components/decorations/BlurGlow.astro` | Soft radial glow behind cards/CTAs. | `placement` (behind-center/left/right), `size`, `color` |
| **FloatingShapes** | `src/components/decorations/FloatingShapes.astro` | SVG shapes (diamonds, crosses, rings, blobs) with drift animation. | `variant` (geometric/organic/minimal), `density`, custom `shapes[]` |
| **PatternOverlay** | `src/components/decorations/PatternOverlay.astro` | SVG pattern overlay (dots, mesh, grid, crosshatch, noise). | `variant`, `opacity` |
| **CornerFlourish** | `src/components/decorations/CornerFlourish.astro` | Decorative SVG corners for cards/sections. | `corner` (top-left/right/all), `variant` (minimal/line/ornate) |
| **SectionWave** | `src/components/decorations/SectionWave.astro` | Wavy/angled/curved SVG dividers between sections. | `variant` (wave/angle/curve/tilt), `flip` |
| **RingDecoration** | `src/components/decorations/RingDecoration.astro` | Concentric rings for hero or branding sections. | `count` (1-3), `size`, `opacity` |
| **Spotlight** | `src/components/decorations/Spotlight.astro` | Skupione światło za nagłówkiem, CTA albo ważnym modułem. | `color`, `size`, `position`, `opacity`, `blur` |
| **SparkleDots** | `src/components/decorations/SparkleDots.astro` | Subtle floating dots or sparkle particles. | `count`, `variant` (dots/sparkles) |

```astro
<!-- Example: Hero with decorations -->
<HeroEditorialBlock>
  <GradientOrb position="top-left" slot="decorations" />
  <FloatingShapes variant="minimal" slot="decorations" />
</HeroEditorialBlock>
```

---

## 💎 Atoms
*Basic building blocks that cannot be broken down further. Purely presentational.*

| Component | Path | Description | Key Props |
| :--- | :--- | :--- | :--- |
| **Button** | `src/components/ui/atoms/Button.astro` | Standard button/link component. | `href`, `variant` (primary/accent/outline/ghost), `hoverText`, `class` |
| **Heading** | `src/components/ui/atoms/Heading.astro` | Semantic heading with design variants. | `tag` (h1-h6), `variant` (hero/section-title/etc), `animate` |
| **Text** | `src/components/ui/atoms/Text.astro` | Body typography and labels. | `variant` (lead/body/accent-label), `class` |
| **SmartImage** | `src/components/ui/atoms/SmartImage.astro` | Optimized image with lazy loading, responsive sizes and placeholder support. | `src`, `alt`, `width`, `height`, `loading`, `decoding`, `fetchpriority`, `sizes`, `folder`, `placeholder`, `class` |
| **Icon** | `src/components/ui/atoms/Icon.astro` | SVG icon wrapper/selector. | `name`, `size`, `class` |
| **Logo** | `src/components/ui/atoms/Logo.astro` | Site logo (SVG or Image). | `variant` (light/dark/color) |
| **Input** | `src/components/ui/atoms/Input.astro` | Styled text input. | `type`, `placeholder`, `name` |
| **Textarea** | `src/components/ui/atoms/Textarea.astro` | Styled multiline input. | `placeholder`, `name`, `rows` |
| **Checkbox** | `src/components/ui/atoms/Checkbox.astro` | Styled checkbox input. | `label`, `name`, `required` |
| **FloatingBar** | `src/components/ui/molecules/FloatingBar.astro` | Floating bar: scroll-to-top + WhatsApp + telefon + Facebook. | - |
| **MockupMedia** | `src/components/ui/atoms/MockupMedia.astro` | Wrapper for images/videos in device frames. | `type` (laptop/mobile), `src` |
| **Toast** | `src/components/ui/atoms/Toast.astro` | Notification feedback element. | `type` (success/error), `message` |
| **Card** | `src/components/ui/atoms/Card.astro` | Generic container with border, radius, and elevation variants. | `variant`, `padding`, `radius`, `elevation` |
| **ChecklistItem** | `src/components/ui/atoms/ChecklistItem.astro` | Pozycja listy z ikoną circle-check. Używana w CtaFeaturesBlock. | `class` |
| **FeatureItem** | `src/components/ui/atoms/FeatureItem.astro` | Wiersz cechy z boxem ikony + tekst. Slot `icon`. | `class` |

### Button Hover System (SSOT)

Every button across the project MUST use the same hover pattern: **Text Swap + Color Slide**.

**Two effects on hover:**
1. **Text Swap** — text slides up and is replaced by the hover span (CSS `.ui-button-text-wrap`)
2. **Color Slide** — `::after` pseudo-element slides up from bottom with variant-specific color

**Text swap jest DOMYŚLNY od 2026-08:** `Button.astro` zawsze renderuje wrap z dwoma spany. Bez `hoverText` hover-span powtarza ten sam tekst (czysty roll, span ma `aria-hidden="true"`). `hoverText` podajesz wyłącznie, gdy labelka na hover ma być inna.

**How to use (preferred — Button.astro atom):**
```astro
<!-- Roll z tą samą labelką (efekt domyślny, hoverText zbędny) -->
<Button href="/blog/" variant="outline">Czytaj wpis</Button>

<!-- Roll z inną labelką na hover -->
<Button href="/kontakt" variant="primary" hoverText="Pisz!">Kontakt</Button>
```

**How to use (raw HTML — navbar, cookie consent):**
```astro
<a class="ui-button ui-button-primary ui-type-cta-label font-semibold" href="/kontakt">
  <span class="ui-button-text-wrap">
    <span class="ui-button-text-default">Kontakt</span>
    <span class="ui-button-text-hover">Pisz!</span>
  </span>
</a>
```

**Variant colors (default theme, defined in `components.css`):**

| Variant | `::after` background | Hover text color |
| :--- | :--- | :--- |
| `primary` | `var(--color-brand-dark)` | white |
| `outline` | `var(--color-brand-primary)` | white |
| `ghost` | `var(--color-brand-primary)` | white |
| `accent` | `var(--color-brand-dark)` | — |

**Rules:**
- `hoverText` jest opcjonalny (roll działa zawsze); jeśli podany, MUST be similar length to default text (avoid button width jumping)
- Raw `ui-button` bez atomu Button MUSI mieć `ui-type-cta-label` (font nagłówkowy + tracking), inaczej tekst dziedziczy font body i wygląda jak obcy element
- Form submit buttons: add `hoverText` BUT update JS to query `.ui-button-text-default` instead of `span`
- Navbar CTA: use raw `<a>` with `ui-button-text-wrap` structure (not `Button.astro`)
- Cookie consent: use raw `<button>` with `ui-button-text-wrap` structure (not `Button.astro`)
- Each theme (`data-theme="gold"`, etc.) can override `::after` colors in `components.css`

### Card Hover Contract (SSOT)

Every interactive card across the project MUST use the same hover animation: **`ui-card-interactive`** (defined in `src/styles/components.css`).

**What the contract gives (one animation everywhere):**
- Hover lift: `translateY(-0.25rem)` via `transform` (NOT `translate` — reveal w motion.css uses the `translate` property, so they never fight)
- Border color: `color-mix(brand-primary 34%, outline)`
- Shadow: `0 1.625rem 4rem color-mix(brand-dark 12%, transparent)`
 - Timing: 250ms `cubic-bezier(0.33, 1, 0.68, 1)` (easeOutCubic — agresywny expo-out przy 200ms wyglądał jak skok), guarded by `@media (hover: hover)` and `prefers-reduced-motion`
- Motion interplay: after reveal entrance (`data-motion-visible`), motion.css restores the 250ms contract instead of the global 600ms override

**Rules:**
- Add `ui-card-interactive` ONLY to cards that should react to hover (plates in grids: `article`/`div`/`a` with rounded + border/bg). Static cards stay static
- NEVER hand-roll `hover:-translate-y-*`, `hover:shadow-*`, `hover:border-*` on a card container
- Keep `hover:bg-*` fill effects if a card has them (keep their transition classes too)
- Keep `group-hover:*` on inner elements and static offsets like `lg:-translate-y-3`
- Contract test: `src/components/ui/atoms/card-contract.test.ts` (CSS assertions + registry scan)

**Example:**
```astro
<!-- BEFORE (zabronione): kazdy blok mial inna animacje -->
<article class="rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl">

<!-- AFTER: -->
<article class="ui-card-interactive rounded-2xl border">
```

---

## 🧱 Patterns
*Reusable combinations of atoms for repeated interaction and form cases. Keep them content-agnostic and pass labels, hints, and options through props.*

| Component | Path | Description | Key Props |
| :--- | :--- | :--- | :--- |
| **SearchField** | `src/components/ui/patterns/SearchField.astro` | Pole wyszukiwania z ikoną, opcjonalnym CTA i tekstem pomocniczym. | `label`, `placeholder`, `actionLabel`, `actionHref`, `hint` |
| **FilterTabs** | `src/components/ui/patterns/FilterTabs.astro` | Przewijany zestaw filtrów z jednym aktywnym elementem. | `items`, `activeId`, `label` |
| **FormField** | `src/components/ui/patterns/FormField.astro` | Pole formularza z etykietą, hintem oraz stanem błędu lub sukcesu. | `label`, `state`, `error`, `hint`, `required` |
| **SelectDropdown** | `src/components/ui/patterns/SelectDropdown.astro` | Rozwijany wybór z natywnym stanem details i aktualizacją wartości hidden input. | `options`, `selectedId`, `label`, `name`, `hint` |
| **ToastFeedback** | `src/components/ui/patterns/ToastFeedback.astro` | Komunikat sukcesu, informacji, ostrzeżenia lub błędu. | `title`, `description`, `type`, `dismissible` |
| **MobileDrawer** | `src/components/ui/patterns/MobileDrawer.astro` | Mobilne menu z linkami i CTA, dostępne inline albo jako overlay. | `links`, `title`, `ctaLabel`, `ctaHref`, `mode` |

Patterns są miejscem dla powtarzalnych układów UI. Jeżeli element jest pojedynczym kontrolkiem, powinien pozostać atomem. Jeżeli składa się z wielu pól lub ma logikę konkretnej sekcji, powinien trafić do właściwego bloku registry.

---

## 🧬 Molecules
*Groups of atoms working together. Simple local state or logic.*

| Component | Path | Description | Key Props |
| :--- | :--- | :--- | :--- |
| **SectionHeader** | `src/components/ui/molecules/SectionHeader.astro` | Standard header for sections. | `tagline`, `title`, `titleAccent`, `description`, `align` |
| **BrandGrid** | `src/components/ui/molecules/BrandGrid.astro` | Responsive grid of partner/client logos. | `brands` (array), `theme` |
| **ButtonGroup** | `src/components/ui/molecules/ButtonGroup.astro` | Horizontal stack of buttons with spacing. | `align`, `class` |
| **Navbar** | `src/components/ui/molecules/Navbar.astro` | Primary site navigation with mobile drawer. | `links`, `logo`, `variant` |
| **Footer** | `src/components/ui/molecules/Footer.astro` | Site footer with links and contact info. | `content` |
| **Breadcrumbs** | `src/components/ui/molecules/Breadcrumbs.astro` | Navigation path indicator. | `items` |
| **TestimonialCard** | `src/components/ui/molecules/TestimonialCard.astro` | Single testimonial entry. | `quote`, `author`, `role`, `image` |
| **CookieConsent** | `src/components/ui/molecules/CookieConsent.astro` | Privacy compliance banner. | - |
| **FloatingBar** | `src/components/ui/molecules/FloatingBar.astro` | Pływający pasek: scroll-to-top, WhatsApp, telefon, Facebook. | - |
| **AvatarStack** | `src/components/ui/molecules/AvatarStack.astro` | Nakładające się avatary z opcjonalnym podpisem. | `avatars[]`, slot `caption` |

---

## 🏗️ Layout Components
*Structural components used to wrap content.*

| Component | Path | Description | Key Props |
| :--- | :--- | :--- | :--- |
| **Section** | `src/components/ui/layout/Section.astro` | Standardized vertical spacing and background. | `id`, `tone` (neutral/base/accent/surface), `class` |
| **Container** | `src/components/ui/layout/Container.astro` | Max-width wrapper with responsive padding. | `size` (default/small/large) |
| **RevealGroup** | `src/components/ui/layout/RevealGroup.astro` | Animation wrapper for staggering children. | `delay`, `interval` |

---

## 📦 Registry Blocks (Organisms)
*Złożone sekcje używane przez PageBuilder. Ich aktualna lista wynika z kodu, a nie z ręcznie utrzymywanej tabeli w dokumentacji.*

`src/config/section-registry.ts` jest źródłem prawdy dla 165 wpisów, wariantów, `dataKey` i grup Studio. Implementacje publicznych bloków znajdują się w `src/components/registry/`, gdzie aktualnie jest 171 plików `.astro` na poziomie publicznego katalogu. `src/config/component-manifest.ts` klasyfikuje je jako `core`, `client`, `catalog` albo `legacy`, a `src/config/component-map.ts` mapuje manifest na importy używane przez PageBuilder. Glob komponentów jest rekurencyjny, lecz manifest chroni przed wystawieniem pomocniczych komponentów z podkatalogów.

Przykładowe aktywne komponenty: `HeroEditorialBlock`, `HeroVideoBlock`, `ModernHouseHeroBlock`, `AboutSplitBlock`, `CardsFilterableBlock`, `ContactPremiumBlock`, `FaqAccordionBlock`, `GalleryCrossfadeBlock`, `PortfolioCategorizedBlock`, `ServicesMediaCardsBlock` i `TestimonialsMarqueeBlock`.

Przed wyborem sekcji sprawdź kolejno section registry, component manifest, dane w `src/data/sections/` oraz konkretny plik Astro.

---

## 🛠️ Smart Blocks (Layout-First)
*Docelowy kierunek, jeszcze niewdrożony jako osobny katalog.*

Na tym etapie nie ma osobnego `src/components/blocks/`. Najpierw ustabilizujemy registry, podzielimy go logicznie na sekcje aktywne, katalogowe i legacy, a dopiero potem będziemy wydzielać wielowariantowe Smart Blocks bez masowego przenoszenia istniejących plików.

---

## 🖥️ Developer Component Library
*Internal UI components for the developer component library.*

| Component | Path | Description |
| :--- | :--- | :--- |
| **ComponentGallery** | `src/components/dev/component-library/ComponentGallery.astro` | Dev-only gallery of registered sections and variants. |
| **ComponentPreview** | `src/components/dev/component-library/ComponentPreview.astro` | Preview shell for an individual registry component. |
| **ComponentPreviewFrame** | `src/components/dev/component-library/ComponentPreviewFrame.astro` | Frame used by the gallery for isolated previews. |

---

## 🧰 Dev Tools
*Narzędzia developerskie widoczne tylko w `import.meta.env.DEV` (nie trafiają na produkcję).*

| Component | Path | Description |
| :--- | :--- | :--- |
| **VersionToolbar** | `src/components/dev/VersionToolbar.astro` | Podgląd wariantów sekcji (VersionToolbar). |
| **FontSwitcherToolbar** | `src/components/dev/FontSwitcherToolbar.astro` | Podgląd alternatywnych par fontów przez `data-font-set` (localStorage). Definicje zestawów w `src/styles/font-switcher.css`. |
| **theme-switcher.js** | `public/js/theme-switcher.js` | Przełącznik motywów `data-theme` (podgląd palet z themes.css na żywo, localStorage). |

---

> [!TIP]
> **Reuse before Create**: Always check if a component exists here before building a new one.
> **Logic Separation**: Keep atoms and molecules pure. Only registry blocks should handle business/content logic.
