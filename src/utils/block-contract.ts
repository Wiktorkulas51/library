// Why: test-only shared helpers for registry block contract tests.
// Contract tests render real Astro components through
// experimental_AstroContainer and assert HTML structure with cheerio.
// This module removes the copy-paste of container setup and negative
// assertions (dead links, legacy client tokens) across 70+ test files.
// Never import this module from runtime components or pages.

import * as cheerio from 'cheerio';
import { expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

export type AstroComponent = Parameters<AstroContainer['renderToString']>[0];

export async function createBlockContainer(): Promise<AstroContainer> {
  return AstroContainer.create();
}

export async function renderBlock(
  container: AstroContainer,
  component: AstroComponent,
  props: Record<string, unknown> = {},
): Promise<string> {
  return container.renderToString(component, { props });
}

export function loadHtml(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}

/** Dead anchor used as a placeholder instead of a real link. */
export function expectNoDeadLinks(html: string): void {
  expect(html).not.toContain('href="#"');
}

// Why: legacy tokens come from client projects the blocks were extracted
// from (lean-creative reveal system, marek-jodlowski color tokens).
// Starter-kit blocks must use brand tokens instead.
const LEGACY_TOKENS = [
  'data-reveal',
  'reveal-group',
  'class="reveal',
  'border-outline',
  'text-on-surface-variant',
  'color-text-primary',
  'color-accent-primary',
  'bg-brand-cream',
];

/**
 * Asserts that rendered HTML contains no legacy client tokens.
 * Pass block-specific tokens (client names, project slugs) via extraTokens.
 */
export function expectNoLegacyTokens(html: string, extraTokens: string[] = []): void {
  for (const token of [...LEGACY_TOKENS, ...extraTokens]) {
    expect(html, `Legacy token leaked into markup: ${token}`).not.toContain(token);
  }
}
