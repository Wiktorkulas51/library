/**
 * Utilities for normalizing and cleaning data received from the CMS (Keystatic).
 * They provide safe defaults for Astro components.
 *
 * Why: client JSON may contain missing fields, null values, empty strings or
 * invalid types. These helpers convert them into safe defaults for components.
 */

export type CtaVariant = 'primary' | 'outline' | 'ghost';

export interface RawCta {
  label?: string | null;
  href?: string | null;
  prefix?: string | null;
  variant?: string | null;
}

export interface NormalizedCta {
  label: string;
  href: string;
  prefix: string;
  variant: CtaVariant;
}

/**
 * Normalizes CTA button data.
 */
export function normalizeCta(raw: RawCta | null | undefined, defaultLabel = 'Dowiedz się więcej'): NormalizedCta {
  // Why: the client may omit the CTA entirely, so null and undefined are valid inputs.
  if (!raw) {
    return {
      label: defaultLabel,
      href: '#',
      prefix: '',
      variant: 'primary'
    };
  }

  // Why: the client may provide any string, so validate it against the allowed variants.
  // Invalid values fall back to primary.
  const validVariants: CtaVariant[] = ['primary', 'outline', 'ghost'];
  const variant = validVariants.includes(raw.variant as CtaVariant) 
    ? (raw.variant as CtaVariant) 
    : 'primary';

  return {
    label: raw.label || defaultLabel,
    href: raw.href || '#',
    prefix: raw.prefix || '',
    variant
  };
}

/**
 * Normalizes text data by trimming whitespace and guaranteeing a string.
 */
export function normalizeText(text: any, fallback = ''): string {
  // Why: JSON may contain a number, object or null instead of a string.
  // Checking the type before trim prevents component failures.
  if (typeof text !== 'string') return fallback;
  return text.trim() || fallback;
}

/**
 * Ensures that a data array exists and contains no empty entries.
 */
export function normalizeArray<T>(arr: any, filterFn?: (item: T) => boolean): T[] {
  // Why: non-array values return an empty array, and the optional filter removes
  // entries that do not satisfy the condition, such as empty objects.
  if (!Array.isArray(arr)) return [];
  const clean = arr.filter(item => item !== null && item !== undefined);
  return filterFn ? clean.filter(filterFn) : clean;
}

export type LocaleKey = 'pl' | 'en';

/**
 * Resolves the locale copy of section JSON with Polish fallback.
 * Replaces the `data[lang] ?? data.pl` one-liner repeated across registry blocks.
 */
export function resolveLocaleContent<T>(jsonData: Record<string, T>, locale?: string): T {
  // Why: section JSON stores per-locale copies; a missing or unknown locale
  // falls back to Polish so the block never renders empty content.
  const fallback = jsonData['pl'] ?? Object.values(jsonData)[0];
  if (!locale) return fallback;
  return jsonData[locale] ?? fallback;
}
