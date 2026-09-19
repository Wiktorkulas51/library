# Implementation Plan - Issue #15: Dedicated Hero Heading Variant

Introduce a dedicated heading variant for hero-level `h1` usage to centralize the main display title styles and remove hardcodes from `Hero.astro`.

## Proposed Changes

### 1. Global Styles (`src/styles/core.css`)
- Define `.ui-type-heading-hero` component class.
- Encapsulate responsive sizing, line-height, and tracking specific to the hero section.

### 2. Heading Atom (`src/components/ui/atoms/Heading.astro`)
- Add `hero` variant to the `Props` type.
- Map `hero` variant to the new `.ui-type-heading-hero` class.

### 3. Hero Block (`src/templates/fix-bud/blocks/Hero.astro`)
- Replace the hardcoded `h1` tag with the `<Heading>` component.
- Apply `variant="hero"` and `level={1}`.
- Preserve local positioning classes (`text-center sm:text-left`) and spacing (`mb-6 sm:mb-8`).

## Detailed Tasks

- [x] **Task 1: Style Globalization**
  - Add `.ui-type-heading-hero` to `src/styles/core.css`.
  - Styles: `text-[clamp(2.05rem,6.5vw,2.6rem)] sm:text-5xl lg:text-8xl leading-[1.05] sm:leading-[1.1] tracking-tight`.

- [x] **Task 2: Component Update**
  - Update `src/components/ui/atoms/Heading.astro` to include the `hero` variant.

- [x] **Task 3: Refactor Hero Section**
  - Update `src/templates/fix-bud/blocks/Hero.astro` to use the new variant.

## Verification
- [ ] Ensure visually identical output for the Hero heading.
- [ ] Check responsive behavior (clamp on mobile, large display on desktop).
