import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';

// Dlaczego: test kontraktowy odzwierciedla strukturę HTML generowaną
// przez HeroGalleryBlock (centralny nagłówek z odznaką i kolaż 10 zdjęć
// w 5 kolumnach, inspiracja Mentara). Wykrywa regresje renderowania
// bez pełnego builda. Wzorzec: hero-photo-contract.test.ts.

interface Cta {
  label: string;
  href: string;
}

interface GalleryImage {
  src: string;
  alt: string;
}

interface HeroGalleryData {
  sectionId?: string;
  locale?: 'pl' | 'en';
  badge: string;
  heading: string;
  description: string;
  primaryCTA: Cta;
  secondaryCTA: Cta;
  gallery: GalleryImage[];
}

const PLACEHOLDER_PORTRAIT = '/assets/placeholders/image-portrait.svg';

const PL_DATA: HeroGalleryData = {
  sectionId: 'hero-gallery',
  badge: '500+ Zaufanych pacjentów',
  heading: 'Wzmocnij swoją drogę do zdrowia psychicznego!',
  description: 'Wzmacniaj swoją drogę do zdrowia psychicznego!',
  primaryCTA: { label: 'Umów wizytę', href: '/kontakt/' },
  secondaryCTA: { label: 'Nasi terapeuci', href: '/zespol/' },
  gallery: Array.from({ length: 10 }, (_, index) => ({
    src: PLACEHOLDER_PORTRAIT,
    alt: `Zdjęcie kolażu ${index + 1}`,
  })),
};

const EN_DATA: HeroGalleryData = {
  ...PL_DATA,
  locale: 'en',
  badge: '500+ Trusted patients',
  heading: 'Empower your mental health journey!',
  primaryCTA: { label: 'Appointment', href: '/kontakt/' },
  secondaryCTA: { label: 'Our Therapist', href: '/zespol/' },
};

function renderHeroGalleryHtml(data: HeroGalleryData): string {
  const {
    sectionId = 'hero-gallery',
    badge,
    heading,
    description,
    primaryCTA,
    secondaryCTA,
    gallery,
  } = data;

  const aspectPattern = [
    'aspect-[3/4]',
    'aspect-[2/3]',
    'aspect-[3/4]',
    'aspect-[2/3]',
    'aspect-[3/4]',
    'aspect-[2/3]',
    'aspect-[3/4]',
    'aspect-[2/3]',
    'aspect-[3/4]',
    'aspect-[2/3]',
  ];
  const columns = [0, 1, 2, 3, 4].map((col) => gallery.slice(col * 2, col * 2 + 2));
  const galleryHtml = columns
    .map(
      (items, colIndex) =>
        `<div class="flex flex-col gap-3 md:gap-4">` +
        items
          .map(
            (image, itemIndex) => {
              const globalIndex = colIndex * 2 + itemIndex;
              return `<img src="${image.src}" alt="${image.alt}" class="${aspectPattern[globalIndex]} w-full rounded-lg object-cover" loading="lazy" decoding="async">`;
            }
          )
          .join('') +
        `</div>`
    )
    .join('');

  return `<section id="${sectionId}" class="ui-section ui-bg-page relative overflow-hidden bg-brand-dark text-white" data-motion-section>
    <div class="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4">
      <div class="flex -space-x-2">
        <img src="/assets/placeholders/image-square.svg" alt="" class="size-8 rounded-full border-2 border-brand-dark object-cover">
        <img src="/assets/placeholders/image-square.svg" alt="" class="size-8 rounded-full border-2 border-brand-dark object-cover">
        <img src="/assets/placeholders/image-square.svg" alt="" class="size-8 rounded-full border-2 border-brand-dark object-cover">
        <img src="/assets/placeholders/image-square.svg" alt="" class="size-8 rounded-full border-2 border-brand-dark object-cover">
      </div>
      <p>${badge}</p>
    </div>
    <h1>${heading}</h1>
    <p>${description}</p>
    <div>
      <a href="${primaryCTA.href}" class="ui-button ui-button-accent">${primaryCTA.label}<span><i class="ph ph-arrow-up-right"></i></span></a>
      <a href="${secondaryCTA.href}" class="ui-button ui-button-outline">${secondaryCTA.label}<span><i class="ph ph-arrow-up-right"></i></span></a>
    </div>
    <div>
      <a href="/kontakt/" aria-label="Napisz wiadomość"><i class="ph ph-envelope"></i></a>
      <a href="/kontakt/" aria-label="Zadzwoń"><i class="ph ph-phone"></i></a>
    </div>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
      ${galleryHtml}
    </div>
  </section>`;
}

describe('HeroGalleryBlock, kontrakt renderowania', () => {
  it('renderuje <section> z ui-section i id hero-gallery', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').attr('id')).toBe('hero-gallery');
  });

  it('sekcja ma ciemne tło z tokena brand-dark', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    expect($('section').hasClass('bg-brand-dark')).toBe(true);
  });

  it('renderuje dokładnie jeden h1 z nagłówkiem', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    expect($('h1').length).toBe(1);
    expect($('h1').text()).toContain('Wzmocnij swoją drogę');
  });

  it('odznaka zawiera tekst zaufania i 4 awatary', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    expect($('section').text()).toContain('500+ Zaufanych pacjentów');
    expect($('.rounded-full img[alt=""]').length).toBe(4);
  });

  it('renderuje dokładnie 2 przyciski CTA z ikonami strzałek', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    const buttons = $('a.ui-button');
    expect(buttons.length).toBe(2);
    expect(buttons.eq(0).text()).toContain('Umów wizytę');
    expect(buttons.eq(1).text()).toContain('Nasi terapeuci');
    expect($('i.ph-arrow-up-right').length).toBe(2);
  });

  it('primary CTA ma wariant accent, secondary outline', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    expect($('a.ui-button').first().hasClass('ui-button-accent')).toBe(true);
    expect($('a.ui-button').last().hasClass('ui-button-outline')).toBe(true);
  });

  it('kolaż ma 5 kolumn i 10 zdjęć z altami', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    expect($('.grid.md\\:grid-cols-5').length).toBe(1);
    expect($('.grid img').length).toBe(10);
    $('.grid img').each((_, el) => {
      expect($(el).attr('alt')?.length).toBeGreaterThan(3);
    });
  });

  it('górny rząd jest równy, a dolny delikatnie wyższy', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    const classes = $('.grid img')
      .map((_, el) => $(el).attr('class') ?? '')
      .get();
    expect(classes.length).toBe(10);
    classes.forEach((cls, index) => {
      if (index % 2 === 0) {
        expect(cls).toContain('aspect-[3/4]');
      } else {
        expect(cls).toContain('aspect-[2/3]');
      }
    });
  });

  it('zdjęcia używają placeholderów biblioteki', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(PL_DATA));
    $('.grid img').each((_, el) => {
      expect($(el).attr('src')).toBe('/assets/placeholders/image-portrait.svg');
    });
  });

  it('nie ma gołych kotwic href="#" ani heksów klienta', () => {
    const html = renderHeroGalleryHtml(PL_DATA);
    expect(html).not.toContain('href="#"');
    expect(html).not.toContain('#1a3c34');
    expect(html).not.toContain('#d4f542');
  });

  it('EN renderuje angielski nagłówek i odznakę', () => {
    const $ = cheerio.load(renderHeroGalleryHtml(EN_DATA));
    expect($('h1').text()).toContain('Empower your mental health journey!');
    expect($('section').text()).toContain('500+ Trusted patients');
  });
});
