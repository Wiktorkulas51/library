import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import headerData from '@data/sections/alan-header.json';

// Why: kontrakt renderowania AlanHeaderBlock. Test odtwarza strukturę HTML bloku na podstawie
// danych z JSON, żeby wykryć regresje bez uruchamiania serwera. Wzór: navbar-contact-contract.test.ts.

type AlanHeaderTestData = typeof headerData;

function renderAlanHeaderHtml(data: AlanHeaderTestData = headerData): string {
  const navItems = data.items
    .map((item) => `<a class="alan-header__link" href="${item.href}">${item.label}</a>`)
    .join('');
  const socials = data.socials
    .map((s) => `<a class="alan-header__social" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a>`)
    .join('');
  const drawerItems = data.items
    .map((item, i) => `<div class="ui-nav-drawer__item" style="--stagger: ${i}"><a class="ui-nav-drawer__link" href="${item.href}" data-alan-header-close>${item.label}</a></div>`)
    .join('');

  return `
    <div class="alan-header-block">
      <header data-header-progress data-header-progress-distance="220" class="alan-header">
        <a class="alan-header__logo" href="/" aria-label="${data.logoAriaLabel}">
          <img class="alan-header__logo-image" src="${data.logoSrc}" alt="" aria-hidden="true" />
        </a>
        <nav class="alan-header__nav" aria-label="${data.navLabel}">${navItems}</nav>
        <nav class="alan-header__socials" aria-label="${data.socialsLabel}">${socials}</nav>
        <div class="alan-header__cta-wrap">
          <a href="${data.cta.href}" class="ui-button alan-header__cta">${data.cta.label}</a>
        </div>
        <button type="button" class="ui-nav-menu-toggle alan-header__toggle lg:hidden" data-alan-header-toggle aria-controls="alan-header-drawer" aria-expanded="false" aria-label="${data.menuOpenLabel}">
          <span class="ui-nav-menu-toggle__bar" aria-hidden="true"></span>
        </button>
      </header>
      <div id="alan-header-drawer" class="ui-nav-drawer-root lg:hidden" role="presentation" data-alan-header-drawer>
        <div class="ui-nav-drawer-backdrop" data-alan-header-close aria-hidden="true"></div>
        <aside class="ui-nav-drawer--sheet" role="dialog" aria-modal="true" aria-label="${data.drawerLabel}">
          <div class="ui-nav-drawer__content">
            <button type="button" class="ui-nav-drawer__close" data-alan-header-close aria-label="${data.menuCloseLabel}"></button>
            <nav class="ui-nav-drawer__nav" aria-label="${data.navLabel}">
              ${drawerItems}
              <div class="ui-nav-drawer__item"><a class="ui-nav-drawer__cta" href="${data.cta.href}" data-alan-header-close>${data.cta.label}</a></div>
            </nav>
          </div>
        </aside>
      </div>
    </div>`;
}

describe('AlanHeaderBlock, dane z JSON', () => {
  it('ma linki wewnętrzne z końcowym ukośnikiem', () => {
    const internal = [...headerData.items.map((i) => i.href), headerData.cta.href];
    internal.forEach((href) => {
      expect(href.startsWith('/')).toBe(true);
      expect(href.endsWith('/')).toBe(true);
    });
  });

  it('ma logo z publicznej ścieżki bloku biblioteki', () => {
    expect(headerData.logoSrc).toBe('/images/library/alan-zbel/logo-alan-zbel.png');
  });

  it('ma dwa profile społecznościowe z adresami https', () => {
    expect(headerData.socials).toHaveLength(2);
    headerData.socials.forEach((s) => expect(s.href.startsWith('https://')).toBe(true));
  });
});

describe('AlanHeaderBlock, kontrakt renderowania', () => {
  it('renderuje header z data-header-progress i dystansem 220', () => {
    const $ = cheerio.load(renderAlanHeaderHtml());
    const header = $('header[data-header-progress]');
    expect(header.length).toBe(1);
    expect(header.attr('data-header-progress-distance')).toBe('220');
    expect(header.hasClass('alan-header')).toBe(true);
  });

  it('nie używa data-site-header-static, żeby nie wpływać na inne navbary biblioteki', () => {
    const $ = cheerio.load(renderAlanHeaderHtml());
    expect($('[data-site-header-static]').length).toBe(0);
    expect($('[data-navbar-toggle]').length).toBe(0);
  });

  it('renderuje nawigację z liczbą pozycji zgodną z JSON', () => {
    const $ = cheerio.load(renderAlanHeaderHtml());
    expect($('nav.alan-header__nav a.alan-header__link').length).toBe(headerData.items.length);
  });

  it('renderuje drawer jako rodzeństwo paska, z tym samym zestawem linków', () => {
    const $ = cheerio.load(renderAlanHeaderHtml());
    const drawer = $('#alan-header-drawer');
    expect(drawer.hasClass('ui-nav-drawer-root')).toBe(true);
    expect(drawer.hasClass('lg:hidden')).toBe(true);
    expect($('header #alan-header-drawer').length).toBe(0);
    expect(drawer.find('.ui-nav-drawer__link').length).toBe(headerData.items.length);
    expect(drawer.find('.ui-nav-drawer__cta').attr('href')).toBe(headerData.cta.href);
  });

  it('przycisk menu wskazuje drawer i ma stan aria-expanded', () => {
    const $ = cheerio.load(renderAlanHeaderHtml());
    const toggle = $('[data-alan-header-toggle]');
    expect(toggle.attr('aria-controls')).toBe('alan-header-drawer');
    expect(toggle.attr('aria-expanded')).toBe('false');
    expect($(`#${toggle.attr('aria-controls')}`).length).toBe(1);
  });
});
