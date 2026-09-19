# SEO Infrastructure Plan

Integration of automated sitemap generation and dynamic robots.txt into the `starter-kit`.

## Objectives
- Automated sitemap generation via `@astrojs/sitemap`.
- Dynamic `robots.txt` endpoint.
- Centralized SEO configuration.

## Proposed Changes

### 1. Dependencies
- Install `@astrojs/sitemap`.

### 2. Configuration
- Update `astro.config.mjs` with `site` and `sitemap()`.
- Create `src/data/seo.json`.

### 3. Endpoints
- Create `src/pages/robots.txt.ts`.

### 4. Layout
- Update `src/layouts/Layout.astro`.
