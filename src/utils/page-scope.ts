// Why: page scope logic is extracted from [...page].astro getStaticPaths.
// It is testable and reusable, avoiding duplicate isAllowed implementations.

import { HERO_SECTION_IDS } from "@config/hero-ids";

/**
 * Checks whether a page slug is allowed by BUILD_SCOPE.pages.
 * The root '/' matches only '/', while other entries act as prefixes.
 */
export function isPageAllowed(slug: string, allowedPages: string[]): boolean {
  const allowAll = !allowedPages || allowedPages.length === 0;
  if (allowAll) return true;
  const pathname = slug === "index" ? "/" : `/${slug}/`;
  return allowedPages.some((p) => {
    const normalized = p.endsWith("/") ? p : `${p}/`;
    if (normalized === "/") return pathname === "/";
    return pathname === normalized || pathname.startsWith(normalized);
  });
}

/**
 * Checks whether the sections include a hero that requires fullBleedTop.
 */
export function hasHeroSection(sectionIds: string[]): boolean {
  return sectionIds.some((id) => (HERO_SECTION_IDS as readonly string[]).includes(id));
}

/**
 * Calculates fullBleedTop for Layout from the navbar variant and section list.
 */
export function getFullBleedTop(
  navbarVariant: string | undefined,
  sectionIds: string[],
): boolean {
  return navbarVariant === "floating" && hasHeroSection(sectionIds);
}
