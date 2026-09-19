# CMS Configuration Structure

This document describes the mapping between the centralized JSON files in `src/data/` and the Sveltia CMS `config.yml`.

## Core Principle
- **JSON as Source of Truth**: All site data lives in `src/data/*.json`.
- **Versioned Config**: The `config.yml` is maintained as a normal Git-tracked Sveltia CMS configuration file.
- **Strict Typing**: TypeScript interfaces in `src/types/config.ts` must match the JSON structure.

## File Mappings

### 1. `header.json`
Mapped to a `file` collection named `settings` or similar.
- `menu`: List of objects (label, href).
- `cta`: Object (label, href, prefix).

### 2. `footer.json`
- `about`: Markdown or String.
- `columns`: List of objects, each containing a list of links.
- `newsletter`: Object (title, description, etc.).
- `legal`: List of objects (label, href).

### 3. `company.json`
- Business details (phone, email, address).
- Social links.

### 4. `seo.json`
- Analytics IDs.
- Default SEO tags.

## Validation
The script `src/scripts/check-cms-config.ts` validates YAML syntax, file coverage, fields and registry references.

### Rules for Adding New Fields
1. Add the field to the appropriate JSON file.
2. Update the TypeScript interface in `src/types/config.ts`.
3. Add the corresponding field to `public/admin/config.yml`.
4. Run `npm run cms:check` to validate the config.
