# Implementation Plan - Issue #18: Globalize Mobile Text Alignment

Establish a global default for heading and paragraph alignment on small screens (center-aligned by default on mobile, left-aligned by default on desktop) to reduce repetition in blocks.

## Proposed Changes

### 1. Heading Atom (`src/components/ui/atoms/Heading.astro`)
- Add `text-center sm:text-left` to the base classes of the component.
- Ensure that local `class` props can still override these defaults.

### 2. Text Atom (`src/components/ui/atoms/Text.astro`)
- Add `text-center sm:text-left` to the base classes of the component.
- Ensure local overrides are possible via the `class` prop.

### 3. Block Refactoring
- Review all blocks in `src/templates/fix-bud/blocks/` and remove redundant `text-center sm:text-left` classes where they match the new global default.
- Ensure sections that should stay centered on desktop (like `About` header) explicitly use `text-center` or `sm:text-center`.

## Detailed Tasks

- [x] **Task 1: Update Atoms**
  - [x] Modify `src/components/ui/atoms/Heading.astro`.
  - [x] Modify `src/components/ui/atoms/Text.astro`.

- [x] **Task 2: Refactor Hero Section**
  - [x] Remove `text-center sm:text-left` from `<Heading>` and `<Text>` in `Hero.astro`.
  - [x] Remove redundant margins if alignment logic changed (e.g., `max-sm:mx-auto`).

- [x] **Task 3: Refactor Other Sections**
  - [x] Review `Services.astro`, `About.astro`, `Portfolio.astro`.
  - [x] Remove local alignment hardcodes where they match the new default.

## Verification
- [ ] Verify that Hero still looks centered on mobile and left-aligned on desktop.
- [ ] Verify that About header remains centered on both mobile and desktop.
- [ ] Check one more section (e.g., Services) for correctness.
