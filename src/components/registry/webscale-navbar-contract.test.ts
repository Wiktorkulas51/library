import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Why: test czyta prawdziwe pliki bloku, a nie kopię markupu, więc regresja w
// komponencie albo w JSON-ie wywróci test od razu.
const block = fs.readFileSync(path.resolve(import.meta.dirname, "webscale/WebscaleNavbarBlock.astro"), "utf8");
const script = fs.readFileSync(path.resolve(import.meta.dirname, "../../../public/js/webscale-navbar.js"), "utf8");
const data = JSON.parse(
  fs.readFileSync(path.resolve(import.meta.dirname, "../../data/sections/webscale-navbar.json"), "utf8"),
) as {
  logoSrc: string;
  services: { items: { label: string; description: string; href: string; icon: string }[] };
  templates: { items: { label: string; description: string; href: string; icon: string }[]; allHref: string };
  tools: { items: { label: string; description: string; href: string; icon: string }[]; allHref: string };
  links: { label: string; href: string }[];
  cta: { label: string; hoverText: string; href: string };
};

const styleBlock = block.slice(block.indexOf("<style>") + "<style>".length, block.indexOf("</style>"));

// Why: wyciąga selektory z CSS, pomijając komentarze i at-rules (@media), żeby sprawdzić zakres.
function extractSelectors(css: string): string[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors: string[] = [];
  for (const match of withoutComments.matchAll(/([^{}]+)\{/g)) {
    const prelude = match[1].trim();
    if (prelude.startsWith("@")) continue;
    prelude.split(",").forEach((selector) => selectors.push(selector.trim()));
  }
  return selectors;
}

const pathPart = (href: string) => href.split(/[?#]/)[0];

describe("WebscaleNavbarBlock, kontrakt renderowania", () => {
  it("renderuje korzeń .wsb-nav z data-wsb-navbar i nagłówek fixed", () => {
    expect(block).toContain('class:list={["wsb-nav", className]}');
    expect(block).toContain("data-wsb-navbar");
    expect(block).toContain('class="wsb-nav__header fixed inset-x-0 top-0 z-50 w-full" data-wsb-header');
  });

  it("czyta treści z JSON i nie używa i18n ani języków", () => {
    expect(block).toContain('import jsonData from "@data/sections/webscale-navbar.json"');
    expect(block).not.toContain("i18n");
    expect(block).not.toContain("getRoute");
    expect(block).not.toContain("LanguageSwitcher");
    expect(block).not.toContain("locale");
  });

  it("nie zawiera atrybutów data-track", () => {
    expect(block).not.toContain("data-track");
    expect(script).not.toContain("data-track");
  });

  it("nie zawiera hardcodowanych kolorów poza definicją zmiennych --wsb-*", () => {
    const hardcodedPrimary = block.match(/#2563EB/gi) ?? [];
    expect(hardcodedPrimary.length).toBe(1);
    expect(styleBlock).toContain("--wsb-primary: #2563EB;");
  });

  it("zakres CSS: każdy selektor zaczyna się od .wsb-nav", () => {
    const selectors = extractSelectors(styleBlock);
    expect(selectors.length).toBeGreaterThan(20);
    expect(selectors.every((selector) => selector.startsWith(".wsb-nav"))).toBe(true);
  });

  it("zawiera regułę prefers-reduced-motion", () => {
    expect(styleBlock).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("ładuje skrypt jako is:inline z data-astro-rerun", () => {
    expect(block).toContain('<script is:inline data-astro-rerun src="/js/webscale-navbar.js"></script>');
  });

  it("nie używa ikon lucide, tylko Phosphor przez Icon atom", () => {
    expect(block).not.toContain("lucide");
    expect(block).toContain('import Icon from "@components/ui/atoms/Icon.astro"');
  });
});

describe("webscale-navbar.json", () => {
  it("ma 5 usług, 4 szablony i 3 narzędzia z tytułem, opisem i ikoną", () => {
    expect(data.services.items).toHaveLength(5);
    expect(data.templates.items).toHaveLength(4);
    expect(data.tools.items).toHaveLength(3);
    [...data.services.items, ...data.templates.items, ...data.tools.items].forEach((item) => {
      expect(item.label).not.toBe("");
      expect(item.description).not.toBe("");
      expect(item.icon).toMatch(/^[a-z-]+$/);
    });
  });

  it("linki wewnętrzne mają ukośnik na końcu ścieżki i nie są martwe", () => {
    const hrefs = [
      ...data.services.items,
      ...data.templates.items,
      ...data.tools.items,
      ...data.links,
      { href: data.templates.allHref },
      { href: data.tools.allHref },
      { href: data.cta.href },
    ].map((item) => item.href);
    hrefs.forEach((href) => {
      expect(href).not.toBe("#");
      expect(pathPart(href).endsWith("/")).toBe(true);
    });
  });

  it("CTA ma etykietę i hoverText", () => {
    expect(data.cta.label).toBe("Wyceń projekt");
    expect(data.cta.hoverText).toBe("Darmowa wycena");
  });

  it("logo wskazuje na skopiowany plik biblioteki", () => {
    expect(data.logoSrc).toBe("/images/library/webscale/webscale-logo.svg");
    expect(fs.existsSync(path.resolve(import.meta.dirname, "../../../public/images/library/webscale/webscale-logo.svg"))).toBe(true);
  });
});

describe("public/js/webscale-navbar.js", () => {
  it("jest idempotentny i sprząta poprzednią inicjalizację", () => {
    expect(script).toContain("window.__wsbNavbarCleanup");
    expect(script).toContain("previousCleanup()");
    expect(script).toContain("controller.abort()");
  });

  it("wiąże się wyłącznie z atrybutami data-wsb-*", () => {
    expect(script).not.toContain("#main-navbar");
    expect(script).not.toContain("#open-menu");
    expect(script).toContain("[data-wsb-navbar]");
  });
});
