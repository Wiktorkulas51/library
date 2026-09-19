# Implementation Plan - Astro Images (MC-204)

Migrate hardcoded external images to Astro native assets (`src/assets/`) and integrate them with Content Collections for automatic optimization and better developer experience.

## User Review Required

> [!IMPORTANT]
> The source images mentioned in the plan (`public/client-assets-webp/`) were not found in the current workspace. I will create the necessary directory structure and prepare the components, but I will need the actual image files to be placed in `src/assets/sections/` to fully verify the optimization.

> [!WARNING]
> Switching to Content Collections (`getCollection`/`getEntry`) will change how data is accessed in components. I will ensure all existing fields are mapped correctly.

## Proposed Changes

### 1. Asset Structure
Create a dedicated directory for section-specific assets to keep them organized and close to their data.

- [NEW] `src/assets/sections/hero/`
- [NEW] `src/assets/sections/services/`
- [NEW] `src/assets/sections/portfolio/`

### 2. Content Configuration
Ensure `src/content/config.ts` is properly set up to resolve images relative to the content files.

#### [MODIFY] [config.ts](file:///d:/Programy/client-projects/starter-kit/src/content/config.ts)
- Verify `image()` is used in `sections` schema.

### 3. Data Migration
Update JSON files in `src/content/sections/` to use relative paths to the images in `src/assets/`.

#### [MODIFY] [hero.json](file:///d:/Programy/client-projects/starter-kit/src/content/sections/hero.json)
- Add `image` and `backgroundImage` fields pointing to `../../assets/sections/hero/...`

#### [MODIFY] [services.json](file:///d:/Programy/client-projects/starter-kit/src/content/sections/services.json)
- Add `image` field to each card in the `cards` array.

### 4. Component Refactoring
Update blocks to use Astro Content Collections and the `<Image />` component.

#### [MODIFY] [Hero.astro](file:///d:/Programy/client-projects/starter-kit/src/templates/fix-bud/blocks/Hero.astro)
- Replace direct JSON import with `getEntry('sections', 'hero')`.
- Replace `<img>` with `import { Image } from 'astro:assets'`.

#### [MODIFY] [Services.astro](file:///d:/Programy/client-projects/starter-kit/src/templates/fix-bud/blocks/Services.astro)
- Replace direct JSON import with `getEntry('sections', 'services')`.
- Replace `<img>` with `<Image />`.

#### [MODIFY] [Portfolio.astro](file:///d:/Programy/client-projects/starter-kit/src/templates/fix-bud/blocks/Portfolio.astro)
- Replace direct JSON import with `getEntry('sections', 'portfolio')`.
- Replace `<img>` with `<Image />`.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify that Astro can resolve and process all images.
- Check the `dist/` folder for optimized WebP images.

### Manual Verification
- Start dev server (`npm run dev`) and check if images render correctly.
- Inspect images in the browser to ensure they are being served from Astro's `_astro/` directory (optimized).
