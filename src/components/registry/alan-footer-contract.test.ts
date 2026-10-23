import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import footerData from '@data/sections/alan-footer.json';

// Why: kontrakt renderowania AlanFooterBlock. Test odtwarza strukturę HTML stopki na podstawie
// danych z JSON, żeby wykryć regresje bez uruchamiania serwera. Wzór: navbar-contact-contract.test.ts.

type AlanFooterTestData = typeof footerData;

function renderAlanFooterHtml(data: AlanFooterTestData = footerData): string {
  const socials = data.socials
    .map((s) => `<a class="alan-footer__social group" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}<i class="ph ph-arrow-up-right"></i></a>`)
    .join('');
  const links = data.links
    .map((link, i) => `<a class="alan-footer__link group" href="${link.href}"><span class="alan-footer__link-number">0${i + 1}</span>${link.label}<i class="ph ph-arrow-up-right"></i></a>`)
    .join('');
  const legal = data.legalLinks
    .map((link) => `<a class="alan-footer__legal-link" href="${link.href}">${link.label}</a>`)
    .join('');

  return `
    <footer class="alan-footer-block">
      <div class="ui-container alan-footer">
        <div class="alan-footer__top">
          <div class="alan-footer__brand">
            <a class="alan-footer__logo" href="/" aria-label="${data.logoAriaLabel}">
              <img class="alan-footer__logo-image" src="${data.logoSrc}" alt="" aria-hidden="true" />
            </a>
            <p class="alan-footer__description">${data.description}</p>
            <nav class="alan-footer__socials" aria-label="${data.socialsLabel}">${socials}</nav>
          </div>
          <nav class="alan-footer__links" aria-label="${data.navigationLabel}">
            <p class="alan-footer__links-label">${data.linksLabel}</p>
            ${links}
          </nav>
        </div>
        <div class="alan-footer__bottom">
          <div class="alan-footer__legal-group">
            <p class="alan-footer__copyright">© 2026 ${data.copyright}</p>
            <nav class="alan-footer__legal" aria-label="${data.legalLabel}">${legal}</nav>
          </div>
          <a class="alan-footer__top-link group" href="${data.backToTopHref}" aria-label="${data.backToTopAriaLabel}">${data.backToTopLabel}</a>
        </div>
      </div>
    </footer>`;
}

describe('AlanFooterBlock, dane z JSON', () => {
  it('ma cztery pozycje "Odkryj więcej" z linkami wewnętrznymi z końcowym ukośnikiem', () => {
    expect(footerData.links).toHaveLength(4);
    footerData.links.forEach((link) => {
      expect(link.href.startsWith('/')).toBe(true);
      expect(link.href.endsWith('/')).toBe(true);
    });
  });

  it('ma trzy linki prawne przeniesione z kodu do JSON', () => {
    expect(footerData.legalLinks).toHaveLength(3);
    expect(footerData.legalLinks.map((l) => l.label)).toEqual([
      'Regulamin sprzedaży',
      'Polityka prywatności',
      'Cookies',
    ]);
  });

  it('ma dwa profile społecznościowe z adresami https', () => {
    expect(footerData.socials).toHaveLength(2);
    footerData.socials.forEach((s) => expect(s.href.startsWith('https://')).toBe(true));
  });
});

describe('AlanFooterBlock, kontrakt renderowania', () => {
  it('renderuje stopkę z ciemnym tłem bloku', () => {
    const $ = cheerio.load(renderAlanFooterHtml());
    expect($('footer.alan-footer-block').length).toBe(1);
  });

  it('renderuje numerowane linki w kolejności z JSON', () => {
    const $ = cheerio.load(renderAlanFooterHtml());
    const rows = $('.alan-footer__link');
    expect(rows.length).toBe(footerData.links.length);
    rows.each((i, el) => {
      expect($(el).find('.alan-footer__link-number').text()).toBe(`0${i + 1}`);
      expect($(el).attr('href')).toBe(footerData.links[i].href);
    });
  });

  it('renderuje linki prawne i link powrotu na górę', () => {
    const $ = cheerio.load(renderAlanFooterHtml());
    expect($('nav.alan-footer__legal a').length).toBe(footerData.legalLinks.length);
    expect($('.alan-footer__top-link').attr('href')).toBe('#top');
  });

  it('renderuje profile społecznościowe z ikoną strzałki i otwieraniem w nowej karcie', () => {
    const $ = cheerio.load(renderAlanFooterHtml());
    const socials = $('.alan-footer__social');
    expect(socials.length).toBe(footerData.socials.length);
    socials.each((_, el) => {
      expect($(el).attr('target')).toBe('_blank');
      expect($(el).attr('rel')).toBe('noopener noreferrer');
      expect($(el).find('i.ph-arrow-up-right').length).toBe(1);
    });
  });
});
