# Implementation Plan - Tokenization (Issue #16)

Tokenize repeated visual values (radius, shadows, surfaces) into CSS variables and utility classes to centralize the design system.

## Proposed Tokens & Classes

### 1. Radius Levels
Add to `:root` in `themes/fix-bud.css`:
- `--ui-radius-sm`: `0.5rem` (for small components)
- `--ui-radius-md`: `1rem` (current `ui-surface-radius-lg`)
- `--ui-radius-lg`: `2rem` (for services cards)
- `--ui-radius-xl`: `2.5rem` (for main calculator cards)

### 2. Elevation Levels
- `--ui-elevation-soft`: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- `--ui-elevation-strong`: (already exists, but refine if needed)

### 3. Surface Patterns (Classes)
Move to `core.css` layer components:
- `.ui-badge-surface`: `bg-brand-primary/5 border border-brand-primary/10 rounded-full`
- `.ui-card-base`: Common background + border + radius + shadow pattern

## Detailed Tasks

- [ ] **Task 1: Update Theme Variables**
  - Modify `src/styles/themes/fix-bud.css` to include the new tokens.
- [ ] **Task 2: Define Core Utility Classes**
  - Update `src/styles/core.css` to use these tokens for high-level UI classes.
- [ ] **Task 3: Migrate Services Block**
  - Replace `rounded-[2rem]` with `.ui-radius-lg`.
  - Replace badge hardcodes with `.ui-badge-surface`.
- [ ] **Task 4: Migrate Calculator and About Blocks**
  - Replace `rounded-[2.5rem]` with `.ui-radius-xl`.
  - Replace repeated card styles.

## Verification
- [ ] Visual 1:1 check of cards in Services.
- [ ] Visual 1:1 check of the Calculator card.
- [ ] Ensure all badges remain consistent.
