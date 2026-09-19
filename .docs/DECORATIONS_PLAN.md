---
title: Dekoracje — Plan wdrożenia
tags: [plan, dekoracje, komponenty]
type: plan
date: 2026-05-20
---

# Plan: System dekoracyjnych komponentów

## Cel

Stworzyć zestaw reużywalnych, konfigurowalnych komponentów dekoracyjnych w `src/components/decorations/`, które bloki mogą wsadzać w slot `decorations`. Obecnie dekoracje są rozrzucone inline po blokach — brak spójności i reużywalności.

---

## Architektura

### Lokalizacja
`src/components/decorations/` — każdy komponent to osobny `.astro` plik.

### Zasady

| Zasada | Opis |
|--------|------|
| `aria-hidden="true"` | Dekoracje są niewidoczne dla asistencji |
| `pointer-events-none` | Nie blokują interakcji |
| `select-none` | Nie zaznaczają się |
| `prefers-reduced-motion` | Wszystkie animacje wyłączone dla oszczędności ruchu |
| Theme-aware | Używają `var(--color-brand-*)` i CSS vars |
| `class` prop | Każdy komponent przyjmuje `class` do overridów pozycji |
| `data-decoration` | Atrybut do potencjalnego analytics/debug |

### Slot system
Bloki które mają slot `decorations`:
- `HeroCenteredBlock`
- `HeroEditorialBlock`
- `ContactPremiumBlock`, `ContactSplitBlock`, `ContactMinimalBlock`, `ContactFullBlock`, `ContactFormSimpleBlock`, `ContactFormFloatingBlock`, `ContactFormSplitBlock`
- `StatsBentoBlock`, `StatsCountersBlock`, `StatsMetricsBarBlock`
- `ServicesGridBlock`, `ServicesSplitBlock`, `ServicesListBlock`
- `ErrorBlock`
- Nowe: każdy blok może dodać `decorations` slot

---

## Komponenty

### 1. `GradientOrb.astro` — Gradientowa kula rozmycia

**Opis**: Pojedynczy gradient blur orb — zastępuje inline wzór z `DefaultHeroDecorations` i innych bloków.

**Props**:
```ts
interface Props {
  color?: string;         // var(--color-brand-primary)
  size?: string;          // '50vw' | '40vw' | '30vw'
  position?: string;      // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  blur?: string;          // '120px' | '100px' | '80px'
  opacity?: string;       // '0.15' | '0.1' | '0.05'
  class?: string;
}
```

**Użycie**:
```astro
<HeroCenteredBlock>
  <GradientOrb position="top-left" slot="decorations" />
  <GradientOrb position="bottom-right" color="var(--color-brand-accent)" slot="decorations" />
</HeroCenteredBlock>
```

---

### 2. `FloatingShapes.astro` — Pływające kształty SVG

**Opis**: Wiele SVG kształtów (koła, diamenty, krzyże) z dryfującą animacją. Inspirowane `EditorialBlobs` ale w wersji geometrycznej, bardziej uniwersalnej.

**Props**:
```ts
interface ShapeConfig {
  type: 'circle' | 'diamond' | 'cross' | 'ring' | 'plus';
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: string;
  animationSpeed?: 'slow' | 'medium' | 'fast';
  animationDelay?: string;
}
interface Props {
  shapes?: ShapeConfig[];     // custom shapes
  variant?: 'geometric' | 'organic' | 'minimal';  // preset sets
  density?: 'low' | 'medium' | 'high';             // preset density
  class?: string;
}
```

**Domyślne presety**:

- **geometric** — diamenty, koła, plusy — nowoczesny, tech vibe
- **organic** — bloby (jak EditorialBlobs) — premium, miękki
- **minimal** — pojedyncze kółka/ringi — subtelne

**Użycie**:
```astro
<HeroEditorialBlock>
  <FloatingShapes variant="geometric" density="medium" slot="decorations" />
</HeroEditorialBlock>
```

---

### 3. `BlurGlow.astro` — Miękki glow

**Opis**: Pojedynczy radialny glow (bez ostrego SVG). Lżejszy od GradientOrb, do użycia za kartami/CTA.

**Props**:
```ts
interface Props {
  color?: string;
  size?: string;        // '20rem' | '30rem'
  placement?: 'behind-center' | 'behind-left' | 'behind-right' | 'behind-top';
  opacity?: string;
  class?: string;
}
```

**Użycie**:
```astro
<Card class="relative">
  <BlurGlow slot="decorations" placement="behind-center" />
  Treść karty...
</Card>
```

---

### 4. `PatternOverlay.astro` — Wzory tła

**Opis**: Nakładka z wzorem (kropki, mesh, siatka) — zastępuje inline sekcje pattern w `core.css`.

**Props**:
```ts
interface Props {
  variant?: 'dots' | 'mesh' | 'grid' | 'crosshatch' | 'noise';
  opacity?: string;         // '0.04' | '0.06'
  color?: string;           // var(--color-brand-primary) | currentColor
  class?: string;
}
```

**Użycie**:
```astro
<Section>
  <PatternOverlay variant="dots" slot="decorations" />
  Treść sekcji...
</Section>
```

---

### 5. `CornerFlourish.astro` — Dekoracyjne narożniki

**Opis**: SVG rogi/kwiatony do ozdabiania kart, sekcji, hero.

**Props**:
```ts
interface Props {
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'all';
  variant?: 'minimal' | 'ornate' | 'line';
  size?: string;        // 'sm' | 'md' | 'lg'
  color?: string;
  class?: string;
}
```

**Użycie**:
```astro
<Card class="relative">
  <CornerFlourish corner="top-left" variant="minimal" slot="decorations" />
  Treść karty...
</Card>
```

---

### 6. `SectionWave.astro` — Fala/divider między sekcjami

**Opis**: SVG wave/angle/curve między sekcjami. Używany na dole sekcji (np. separator między hero a features).

**Props**:
```ts
interface Props {
  variant?: 'wave' | 'angle' | 'curve' | 'tilt';
  color?: string;         // fill color (default: var(--ui-bg-page))
  flip?: boolean;         // flip vertically
  class?: string;
}
```

**Użycie**:
```astro
<Section>...</Section>
<SectionWave variant="wave" />
<Section>...</Section>
```

---

### 7. `RingDecoration.astro` — Koncentryczne pierścienie

**Opis**: Dekoracyjne pierścienie/okręgi do hero, sekcji brandingowych.

**Props**:
```ts
interface Props {
  count?: number;        // 1-3 rings
  size?: string;         // base size (default: '30rem')
  color?: string;
  opacity?: string;
  class?: string;
}
```

---

### 8. `SparkleDots.astro` — Kropki/particle tła

**Opis**: Rozproszone małe kropki jak konstelacje — subtelne tło.

**Props**:
```ts
interface Props {
  count?: 12 | 24 | 48;
  variant?: 'dots' | 'sparkles';
  color?: string;
  class?: string;
}
```

---

## Demo Page

**Ścieżka**: `src/pages/decorations-demo.astro`

### Struktura strony:

```
┌─────────────────────────────────────────┐
│  Navbar (header)                        │
├─────────────────────────────────────────┤
│  1. HERO — GradientOrb + FloatingShapes  │
│     (HeroCenteredBlock z dekoracjami)    │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│  2. KATALOG — każdy komponent osobno    │
│     w kontekście + kod użycia           │
│                                         │
│  2a. GradientOrb (3 warianty)           │
│  2b. FloatingShapes (3 presety)         │
│  2c. BlurGlow (3 placementy)            │
│  2d. PatternOverlay (5 wariantów)       │
│  2e. CornerFlourish (warianty)          │
│  2f. SectionWave (4 warianty)           │
│  2g. RingDecoration                     │
│  2h. SparkleDots                        │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│  3. REAL USE — bloki z dekoracjami      │
│                                         │
│  3a. HeroCenteredBlock + GradientOrb    │
│  3b. ContactPremiumBlock + FloatingShapes│
│  3c. CTA + BlurGlow                     │
│  3d. Stats + PatternOverlay             │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

### Zawartość sekcji KATALOG:

Każdy komponent pokazany w `div`-kontenerze z:
- **Nazwą komponentu** (Heading)
- **Podglądem** (komponent w kontenerze o wys. ~250px z przyciemnionym tłem)
- **Kodem użycia** (blok `<pre><code>`)
- **Propsami** (tabelka z dostępnymi opcjami)
- Przełącznikiem presetu/wariantu (gdzie ma sens)

### Zakładki / Preset Switcher:

Przy każdym komponencie z presetami — klikalne przyciski zmieniające wariant (np. FloatingShapes: geometric | organic | minimal). Używa Alpine.js (już jest w projekcie) do interaktywności.

---

## Integracja z istniejącymi blokami

Po stworzeniu komponentów, zrefaktorować istniejące bloki aby używały nowych dekoracji zamiast inline:

| Blok | Obecnie inline | Zastąpić |
|------|---------------|----------|
| `DefaultHeroDecorations` | 2x blur gradient | `GradientOrb` ×2 |
| `ContactPremiumBlock` | 2x radial gradient blob | `GradientOrb` lub `FloatingShapes(variant="organic")` |
| `StatsBentoBlock` | blur glow na hover | `BlurGlow` |
| `FooterColumnsBlock` | blur gradient | `GradientOrb` |
| `FooterPromoBlock` | blur gradient | `GradientOrb` |
| `AboutSplitBlock` | 2x blur circle | `GradientOrb` ×2 |
| `BenefitsZigZagBlock` | border corner | `CornerFlourish` |
| `ScopeSplitBlock` | floating badge | `FloatingShapes` (częściowo) |

---

## Kolejność implementacji

1. **GradientOrb** + **BlurGlow** — najprostsze, najbardziej potrzebne
2. **FloatingShapes** — kluczowy, unifikuje EditorialBlobs
3. **PatternOverlay** — przydatny do tła sekcji
4. **CornerFlourish** + **RingDecoration** — do kart i sekcji premium
5. **SectionWave** — do dividers
6. **SparkleDots** — subtelne tło
7. **Strona demo** — `decorations-demo.astro`
8. **Refaktor** istniejących bloków inline → dekoracje

---

## Komendy

```bash
npm run dev              # podgląd demo na localhost
# dekoracje dostępne pod: /decorations-demo
```

## Theme switching

Demo page wspiera `?theme=blush | fix-bud | gold` aby pokazać jak dekoracje reagują na zmianę brandu (dzięki `var(--color-brand-*)`).
