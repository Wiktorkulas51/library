// Single source of truth for site / client project configuration.
// Edit THIS file when changing domain.
// Environment domain used during build.
export const SITE_URL = 'https://test.webscale.pl';
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
  // Allowlist of standard template pages to keep in the default build.
  // Prefix works: '/pl' keeps '/pl/', '/pl/cookies/' etc.
  // 404 is always kept regardless of this list.
  pages: [
    '/',
    '/about',
    '/blog',
    '/cennik',
    '/contact',
    '/cookies',
    '/kontakt',
    '/o-nas',
    '/polityka-prywatnosci',
    '/portfolio',
    '/pricing',
    '/realizacje',
    '/regulamin',
    '/services',
    '/uslugi',
  ],
  // Denylist — always removed from dist/ (dev-only, prototypes, demo).
  // Entry matches by first path segment. Dev and QA stay out of production build.
  forceRemove: ['starwind-demo', 'layout-test', 'roofing', 'admin', 'dev', 'qa'],
  // Real client assets stay available in dev previews but never ship in the template build.
  exclude: [
    'assets/kasia',
    'assets/piekary9',
    'js/kasia-navbar.js',
    'js/kasia-results-slider.js',
    'js/kasia-timeline.js',
    'js/mystek-training-configurator.js',
  ],
  // Whether to clean unused media (images, videos, fonts) from dist/.
  images: true,
};
