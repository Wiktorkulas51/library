import { describe, expect, it } from 'vitest';
import { normalizeUrl, parsePage, parseSitemapDocument, validateJsonLd } from './seo-crawl';

describe('SEO crawler', () => {
  it('detects metadata, heading and image issues', () => {
  const page = parsePage(
    '<html><head><title>Krótki</title><script type="application/ld+json">{</script></head><body><h1>A</h1><h3>B</h3><img src="x"></body></html>',
    new URL('http://127.0.0.1:4321/test/'),
    200,
    'http://127.0.0.1:4321/test/',
    'text/html',
    10,
    ['/'],
    null,
  );

    expect(page.issues.some((issue) => issue.code === 'invalid_json_ld')).toBe(true);
    expect(page.issues.some((issue) => issue.code === 'image_missing_alt')).toBe(true);
    expect(page.issues.some((issue) => issue.code === 'heading_skip')).toBe(true);
  });

  it('removes tracking data and preserves file extensions during URL normalization', () => {
  const file = normalizeUrl('/portfolio/demo/about.html#team', new URL('http://127.0.0.1:4321/'));
    expect(file?.pathname).toBe('/portfolio/demo/about.html');

  const page = normalizeUrl('/blog/?utm_source=newsletter&gclid=abc&view=full#top', new URL('http://127.0.0.1:4321/'));
    expect(page?.href).toBe('http://127.0.0.1:4321/blog/?view=full');
  });

  it('reads sitemap indexes and URL sets', () => {
  const index = parseSitemapDocument('<sitemapindex><sitemap><loc>https://example.com/sitemap-0.xml</loc></sitemap></sitemapindex>');
    expect(index.root).toBe('sitemapindex');
    expect(index.locations).toEqual(['https://example.com/sitemap-0.xml']);

  const urlset = parseSitemapDocument('<urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/oferta/</loc></url></urlset>');
    expect(urlset.root).toBe('urlset');
    expect(urlset.locations).toEqual(['https://example.com/', 'https://example.com/oferta/']);
  });

  it('checks schema context and required JSON-LD fields', () => {
  const valid = validateJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'A useful article',
    datePublished: '2026-09-16T00:00:00.000Z',
    author: { '@type': 'Person', name: 'Author' },
    image: ['https://example.com/image.webp'],
  });
    expect(valid.types).toEqual(['Article']);
    expect(valid.issues).toHaveLength(0);

  const invalid = validateJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '',
    datePublished: 'not-a-date',
    author: {},
    image: ['/relative-image.webp'],
  });
    expect(invalid.issues.some((issue) => issue.code === 'json_ld_missing_field')).toBe(true);
    expect(invalid.issues.some((issue) => issue.code === 'json_ld_invalid_date')).toBe(true);
    expect(invalid.issues.some((issue) => issue.code === 'json_ld_invalid_url')).toBe(true);
  });
});
