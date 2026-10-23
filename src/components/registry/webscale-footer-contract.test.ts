import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Why: test czyta prawdziwe pliki bloku stopki, a nie kopię markupu.
const block = fs.readFileSync(path.resolve(import.meta.dirname, "webscale/WebscaleFooterBlock.astro"), "utf8");
const data = JSON.parse(
  fs.readFileSync(path.resolve(import.meta.dirname, "../../data/sections/webscale-footer.json"), "utf8"),
) as {
  wordmark: string;
  socials: { label: string; href: string; icon: string }[];
  columns: { title: string; links: { label: string; href?: string }[] }[];
  copyright: { owner: string; rights: string };
};

const styleBlock = block.slice(block.indexOf("<style>") + "<style>".length, block.indexOf("</style>"));

// Why: wyciąga selektory z CSS, pomijając komentarze i at-rules (@media).
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

describe("WebscaleFooterBlock, kontrakt renderowania", () => {
  it("renderuje footer .wsb-footer z sekcją logo, opisu i social", () => {
    expect(block).toContain('class:list={["wsb-footer relative border-t border-white/10 bg-white/5 backdrop-blur-xl", className]}');
    expect(block).toContain("t.socials.map");
    expect(block).toContain("t.description");
  });

  it("giant wordmark jest ukryty na mobile i aria-hidden", () => {
    expect(block).toContain('class="pointer-events-none absolute inset-x-0 bottom-0 top-[35%] z-0 hidden items-end justify-center overflow-hidden md:flex" aria-hidden="true"');
    expect(block).toContain("{t.wordmark}");
  });

  it("nie zawiera wariantu z ramą ani shadera", () => {
    expect(block).not.toContain("ShaderCanvas");
    expect(block).not.toContain("FrameRule");
    expect(block).not.toContain("frame");
  });

  it("czyta dane z JSON bez i18n i bez data-track", () => {
    expect(block).toContain('import jsonData from "@data/sections/webscale-footer.json"');
    expect(block).not.toContain("i18n");
    expect(block).not.toContain("getRoute");
    expect(block).not.toContain("data-track");
  });

  it("nie zawiera hardcodowanych kolorów poza zmiennymi --wsb-*", () => {
    expect(block.match(/#2563EB/gi) ?? []).toHaveLength(1);
    expect(styleBlock).toContain("--wsb-primary: #2563EB;");
  });

  it("zakres CSS: każdy selektor zaczyna się od .wsb-footer", () => {
    const selectors = extractSelectors(styleBlock);
    expect(selectors.length).toBeGreaterThan(5);
    expect(selectors.every((selector) => selector.startsWith(".wsb-footer"))).toBe(true);
  });

  it("zawiera regułę prefers-reduced-motion", () => {
    expect(styleBlock).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("wymusza końcowy ukośnik tylko dla linków wewnętrznych, nie dla pliku RSS", () => {
    expect(block).toContain('href.endsWith(".xml") ? href : formatInternalLink(href)');
  });
});

describe("webscale-footer.json", () => {
  it("ma wordmark WEBSCALE i 7 linków social z ikoną", () => {
    expect(data.wordmark).toBe("WEBSCALE");
    expect(data.socials).toHaveLength(7);
    data.socials.forEach((social) => {
      expect(social.href.startsWith("https://")).toBe(true);
      expect(social.icon).toMatch(/^[a-z-]+$/);
    });
  });

  it("ma 4 kolumny linków z tytułem", () => {
    expect(data.columns.map((column) => column.title)).toEqual(["Rozwiązania", "Informacje", "Kontakt", "Firma"]);
  });

  it("linki wewnętrzne kończą się ukośnikiem, poza plikiem RSS", () => {
    const internal = data.columns
      .flatMap((column) => column.links)
      .map((link) => link.href)
      .filter((href): href is string => typeof href === "string" && href.startsWith("/"));
    internal.forEach((href) => {
      if (href.endsWith(".xml")) return;
      expect(href.endsWith("/")).toBe(true);
    });
    expect(internal).toContain("/blog/rss.xml");
  });

  it("ma prawa autorskie i informację o działaniu", () => {
    expect(data.copyright.owner).toBe("WebScale.pl.");
    expect(data.copyright.rights).toBe("Wszelkie prawa zastrzeżone.");
  });
});
