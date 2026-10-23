import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Why: blok nie ma renderera w teście, więc kontrakt sprawdza źródło Astro i dane JSON.
// Dzięki temu regresja (np. powrót na sztywne id="kontakt" albo utrata zmiennych koloru) wychodzi od razu.
const block = fs.readFileSync(path.resolve(import.meta.dirname, "nova/NovaFooterBlock.astro"), "utf8");
const dataRaw = fs.readFileSync(path.resolve(import.meta.dirname, "../../data/sections/nova-footer.json"), "utf8");
const data = JSON.parse(dataRaw) as {
  anchorId?: string;
  eyebrow: string;
  heading: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  legalLinks: { label: string; href: string }[];
  footerLinks: { label: string; href: string }[];
  ariaLegal: string;
  ariaNavigation: string;
  copyright: string;
  attributionPrefix: string;
  attributionLinkLabel: string;
  attributionLinkHref: string;
  backgroundImage: { src: string; alt: string };
  overlayOpacity: number;
};

const publicRoot = path.resolve(import.meta.dirname, "../../../public");

// Why: style block to fragment wejściowych selektorów; zakres CSS musi startować od korzenia bloku.
function getStyleBlock(source: string): string {
  const match = source.match(/<style>([\s\S]*?)<\/style>/);
  return match ? match[1] : "";
}

function getTemplate(source: string): string {
  return source.split("---", 3)[2]?.split("<style>")[0] ?? "";
}

describe("NovaFooterBlock: struktura i atomy", () => {
  it("używa atomów biblioteki zamiast surowego HTML tekstów i przycisków", () => {
    expect(block).toContain('import Button from "@components/ui/atoms/Button.astro"');
    expect(block).toContain('import Heading from "@components/ui/atoms/Heading.astro"');
    expect(block).toContain('import Text from "@components/ui/atoms/Text.astro"');
    expect(block).toContain('import Container from "@components/ui/layout/Container.astro"');

    const template = getTemplate(block);
    expect(template).not.toMatch(/<(p|h1|h2|h3)[\s>]/);
  });

  it("mapuje oba przyciski na warianty biblioteki accent i outline", () => {
    expect(block).toContain('variant="accent"');
    expect(block).toContain('variant="outline"');
  });

  it("nie zawiera sztywnego id kontakt w bloku, a kotwica pochodzi z JSON", () => {
    expect(block).not.toContain('id="kontakt"');
    expect(block).toContain("copy.anchorId || undefined");
    expect(data.anchorId).toBe("kontakt");
  });

  it("nie używa klas tła z globalnych tokenów dla przyciemnienia", () => {
    expect(block).not.toContain("bg-brand-dark/60");
    expect(block).toContain("--nova-footer-overlay-opacity");
    expect(block).toContain("overlayOpacity");
  });
});

describe("NovaFooterBlock: zakres CSS i kolory", () => {
  const css = getStyleBlock(block);

  it("każda reguła CSS zaczyna się od korzenia bloku .nova-footer", () => {
    // Why: regex łapie też selektory zagnieżdżone w @media, a nie tylko pierwszy poziom.
    const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{/g)]
      .map((match) => match[1].trim())
      .filter((selector) => selector.length > 0 && !selector.startsWith("@"));

    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      for (const part of selector.split(",")) {
        expect(part.trim().startsWith(".nova-footer")).toBe(true);
      }
    }
  });

  it("ustawia kolory Nova jako zmienne na korzeniu zgodne z motywem T001-Nova", () => {
    expect(css).toContain("--nova-footer-brand-dark: #161616;");
    expect(css).toContain("--nova-footer-brand-light: #fffdf9;");
    expect(css).toContain("--nova-footer-brand-accent: #b98b6e;");
  });

  it("nie zawiera przypadkowych kolorów hex poza zmiennymi korzenia", () => {
    const hexOutsideRoot = css
      .split("}")
      .filter((chunk) => !chunk.includes("--nova-footer-brand-dark: #161616"))
      .join("}")
      .match(/#[0-9a-fA-F]{3,6}\b/g);
    expect(hexOutsideRoot ?? []).toEqual([]);
  });
});

describe("NovaFooterBlock: obraz tła", () => {
  it("używa obrazu z JSON z lazy loadingiem i pustym alt, bo jest dekoracją", () => {
    expect(block).toContain("copy.backgroundImage.src");
    expect(block).toContain('loading="lazy"');
    expect(block).toContain('decoding="async"');
    expect(data.backgroundImage.alt).toBe("");
  });

  it("plik tła istnieje w public pod ścieżką z JSON", () => {
    const filePath = path.join(publicRoot, data.backgroundImage.src.replace(/^\//, ""));
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("przyciemnienie jest liczbą w zakresie 0-1", () => {
    expect(data.overlayOpacity).toBeGreaterThan(0);
    expect(data.overlayOpacity).toBeLessThanOrEqual(1);
  });
});

describe("nova-footer.json: treści i linki", () => {
  it("zawiera wszystkie pola treści bez pustych wartości", () => {
    const textFields = [
      data.eyebrow,
      data.heading,
      data.description,
      data.primaryLabel,
      data.secondaryLabel,
      data.ariaLegal,
      data.ariaNavigation,
      data.copyright,
      data.attributionPrefix,
      data.attributionLinkLabel,
    ];
    for (const value of textFields) {
      expect(value.trim().length).toBeGreaterThan(0);
    }
  });

  it("linki nawigacyjne i prawne mają etykiety i poprawne ścieżki", () => {
    const links = [...data.legalLinks, ...data.footerLinks];
    expect(data.legalLinks.length).toBeGreaterThan(0);
    expect(data.footerLinks.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.label.trim().length).toBeGreaterThan(0);
      const isAnchor = link.href.startsWith("#");
      const isExternal = link.href.startsWith("https://");
      expect(isAnchor || isExternal || link.href.startsWith("/")).toBe(true);
    }
  });

  it("wewnętrzne ścieżki kończą się ukośnikiem, zgodnie z konwencją projektu", () => {
    const internal = [...data.legalLinks, ...data.footerLinks]
      .map((link) => link.href)
      .filter((href) => href.startsWith("/"));
    for (const href of internal) {
      expect(href.endsWith("/")).toBe(true);
    }
  });

  it("nie zawiera myślników długich ani krótkich w tekstach", () => {
    expect(dataRaw).not.toMatch(/[–—]/);
  });

  it("atrybucja prowadzi do WebScale w nowej karcie", () => {
    expect(data.attributionLinkHref).toBe("https://webscale.pl");
    expect(block).toContain('target="_blank"');
    expect(block).toContain('rel="noreferrer"');
  });
});
