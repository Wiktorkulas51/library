import { describe, it, expect, beforeAll } from 'vitest';
import type { experimental_AstroContainer as AstroContainer } from 'astro/container';
import FaqAccordionBlock from '@components/registry/faq/FaqAccordionBlock.astro';
import {
  createBlockContainer,
  renderBlock,
  loadHtml,
  expectNoDeadLinks,
  expectNoLegacyTokens,
} from '@utils/block-contract';

// Why: contract test renders the REAL FaqAccordionBlock through
// experimental_AstroContainer and checks HTML structure with cheerio,
// so refactors of the block (e.g. shared FaqAccordionItem molecule)
// are caught here instead of passing against a stale markup copy.
describe('FaqAccordion, kontrakt renderowania', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await createBlockContainer();
  });

  it('renderuje <section> z ui-section, ui-bg-page i id', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('ui-bg-page')).toBe(true);
    expect($('section').attr('id')).toBe('faq');
  });

  it('renderuje nagłówek sekcji z tagline, tytułem i opisem z JSON', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    expect($('h2').text()).toContain('Najczęściej Zadawane Pytania');
    expect($('section').text()).toContain('FAQ');
    expect($('section').text()).toContain('Dowiedz się, jak dbamy');
  });

  it('renderuje wszystkie pytania z JSON jako <details>', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    expect($('details').length).toBe(6);
  });

  it('pierwsze pytanie jest domyślnie otwarte (open), pozostałe nie', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    expect($('details').eq(0).attr('open')).toBeDefined();
    expect($('details').eq(1).attr('open')).toBeUndefined();
    expect($('details').eq(5).attr('open')).toBeUndefined();
  });

  it('każde pytanie ma summary z h3 i ikoną plusa (SVG)', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    $('details').each((_, el) => {
      const summary = $(el).find('summary');
      expect(summary.length).toBe(1);
      expect(summary.find('h3').length).toBe(1);
      expect(summary.find('svg').length).toBe(1);
      expect(summary.find('svg').find('path').attr('d')).toContain('M12 4v16m8-8H4');
    });
  });

  it('pytanie h3 ma styl !text-[16px] z brand-dark/80 (wzorzec klienta)', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    const h3 = $('h3').first();
    expect(h3.hasClass('!text-[16px]')).toBe(true);
    expect(h3.hasClass('font-medium')).toBe(true);
    expect(h3.hasClass('text-brand-dark/80')).toBe(true);
  });

  it('odpowiedź renderuje się w .faq-answer z ui-text-on-light-subtle', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    const answer = $('.faq-answer').first();
    expect(answer.length).toBe(1);
    expect(answer.find('.ui-text-on-light-subtle').length).toBe(1);
    expect(answer.text()).toContain('Nie jest to warunek konieczny.');
  });

  it('accordion jest ograniczony do max-w-2xl (wzorzec klienta)', async () => {
    const $ = loadHtml(await renderBlock(container, FaqAccordionBlock));
    const wrap = $('[data-accordion]');
    expect(wrap.length).toBe(1);
    expect(wrap.hasClass('max-w-2xl')).toBe(true);
    expect(wrap.hasClass('mx-auto')).toBe(true);
    expect(wrap.hasClass('mt-12')).toBe(true);
    expect(wrap.hasClass('w-full')).toBe(true);
  });

  it('przyjmuje nadpisanie propsów (tytuł i pytania)', async () => {
    const $ = loadHtml(
      await renderBlock(container, FaqAccordionBlock, {
        title: 'Własny tytuł',
        items: [{ q: 'Pytanie?', a: 'Odpowiedź.' }],
      }),
    );
    expect($('h2').text()).toContain('Własny tytuł');
    expect($('details').length).toBe(1);
    expect($('h3').text()).toContain('Pytanie?');
  });

  it('nie zawiera legacy tokenów klienta', async () => {
    const html = await renderBlock(container, FaqAccordionBlock);
    expectNoLegacyTokens(html, ['faq-accordion']);
  });

  it('nie zawiera href="#"', async () => {
    const html = await renderBlock(container, FaqAccordionBlock);
    expectNoDeadLinks(html);
  });
});
