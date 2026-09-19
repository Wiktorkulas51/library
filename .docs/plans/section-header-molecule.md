# Implementation Plan - Section Header Molecule

Create a centralized `SectionHeader` molecule to handle the layout and alignment of section titles, eyebrows, and descriptions across the template.

## Proposed Changes

### 1. New Molecule (`src/components/ui/molecules/SectionHeader.astro`)
- Define a component that encapsulates the "Eyebrow + Heading + Description" pattern.
- **Alignment Logic**: Default to `text-center sm:text-left` behavior, but allow `center` for both (using props).
- **Layout**: Handle the wrapper width and margins centrally.
- **Slots/Props**:
    - `eyebrow` (string/slot)
    - `title` (string/slot)
    - `description` (string/slot)
    - `align`: `start` | `center` (default: `center` on mobile, `start` on desktop).

### 2. Global Styles (`src/styles/core.css`)
- Add a helper class `.ui-section-header` if needed for complex flex layouts.

### 3. Block Refactoring
- Replace manual header layouts in:
    - `Services.astro`
    - `About.astro`
    - `Portfolio.astro`
    - `Calculator.astro`

## Detailed Tasks

- [x] **Task 1: Create the Molecule**
  - Implement `src/components/ui/molecules/SectionHeader.astro`.
- [x] **Task 2: Update core.css**
  - Add structural classes for the header if necessary (handled in molecule).
- [x] **Task 3: Refactor Services Block**
  - Replace the complex flex container with `SectionHeader`.
- [x] **Task 4: Refactor Other Blocks**
  - Update `About.astro`, `Portfolio.astro`, and `Calculator.astro`.

## Verification
- [ ] Check mobile centering for all refactored sections.
- [ ] Check desktop alignment (Services should be left-aligned, About should be centered).
