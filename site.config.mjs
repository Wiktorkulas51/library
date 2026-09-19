// Local source of truth for the component library configuration.
export const SITE_URL = 'http://localhost:4324';
export const ACTIVE_TEMPLATE = 'default';

// Locale & i18n — detachable
// English-first product: code/docs/demo content are English. Client site language is configurable.
// Single-language mode: locale = 'pl' | 'en' | 'de', i18n.enabled = false → no /pl/ prefix, no switcher, no t().
// Multi-language mode: i18n.enabled = true, locales = ['pl','en'] → routing and switcher active.
export const SITE_LOCALE = 'en';
export const I18N_CONFIG = {
  enabled: false,
  locales: ['en'],
  defaultLocale: 'en',
};

// BUILD_SCOPE — what goes into build (dist/) and what stays dev-only.
// Dev has everything (for prototyping), build is clean per project scope.
// Example one-page: pages: ['/', '/pl'] keeps only homepage
// (EN + PL) + 404, removes other subpages (blog, contact, services...).
export const BUILD_SCOPE = {
  // The library is a catalog, so every canonical catalog route belongs in the build.
  // The empty list means all pages, while the dev denylist stays active below.
  pages: [],
  // Denylist — always removed from dist/ (dev-only, prototypes, demo).
  // Entry matches by first path segment. Dev and QA stay out of production build.
  forceRemove: ['starwind-demo', 'layout-test', 'roofing', 'admin', 'dev', 'qa'],
  // Reference assets remain available because the library previews client-origin components locally.
  exclude: [],
  // Whether to clean unused media (images, videos, fonts) from dist/.
  images: true,
};
