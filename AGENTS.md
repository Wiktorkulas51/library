# UI Library Context

This repository is a standalone Astro catalog of reusable WebScale UI components. It is not a client website and does not contain CMS, client deployment, forms, analytics, or FTP workflows.

## Source of truth

- `src/config/component-manifest.ts` defines registered components.
- `src/config/section-registry.ts` defines section families and variants.
- `src/data/dev/component-library/` defines catalog metadata.
- `src/styles/global.css`, `src/styles/themes.css`, and `DESIGN_RULES.md` define visual rules.
- `site.config.mjs` defines the library build scope.

## Working rules

- Use canonical library routes rooted at `/`. Do not add new `/dev/components/` routes.
- Reuse existing UI primitives, tokens, utilities, and registry patterns before creating new ones.
- Keep presentation components independent from client business logic and CMS concerns.
- Preserve unrelated work in the working tree and stage only task-scoped files.
- After code changes run `npm run check:types`, focused tests, `npm run build`, and `npm run check:build-output`.
- After UI changes inspect `/` and the relevant `/components/.../` preview at mobile and desktop widths.
