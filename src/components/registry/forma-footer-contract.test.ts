import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import footerData from "../../data/sections/forma-footer.json";

// Why: Stopka Forma w wariancie graphite-quiet. Test pilnuje tła, odwróconego logo,
// zakresu klas bloku i tego, że dane pochodzą z JSON, a nie z kodu.
const blockSource = fs.readFileSync(path.resolve(import.meta.dirname, "forma/FormaFooterBlock.astro"), "utf8");

describe("FormaFooterBlock", () => {
  it("ma ciemne tło i odwrócone logo w stylach bloku", () => {
    expect(blockSource).toContain("background: var(--color-brand-dark);");
    expect(blockSource).toContain("filter: brightness(0) invert(1);");
  });

  it("nie używa generycznych nazw klas z oryginału", () => {
    const genericSelector = /(^|[\s,(])\.(footer|footer-inner|footer-intro|footer-wordmark|footer-credit|footer-note)\b/m;
    expect(blockSource).not.toMatch(genericSelector);
    expect(blockSource).not.toMatch(/class="(footer|footer-inner|footer-intro|footer-wordmark|footer-credit)"/);
  });

  it("CTA intro ma podkreślenie i strzałkę arrow-loop bez wypełnionego przycisku", () => {
    expect(blockSource).toContain("border-bottom: 1px solid currentColor;");
    expect(blockSource).toContain("forma-arrow-loop--inline");
    expect(blockSource).not.toContain("ui-button");
  });

  it("kredyt otwiera się w nowej karcie z bezpiecznym rel", () => {
    expect(blockSource).toContain('target="_blank" rel="noopener noreferrer"');
    expect(footerData.credit.href).toBe("https://webscale.pl");
  });

  it("dane z JSON zawierają tekst intro w dwóch liniach i pięć linków", () => {
    expect(footerData.introLines).toHaveLength(2);
    expect(footerData.links).toHaveLength(5);
    expect(footerData.introCta.label).toBe("Porozmawiajmy o projekcie");
    expect(footerData.wordmarkSrc).toBe("/images/library/forma/forma-wordmark.png");
  });

  it("zachowuje obsługę prefers-reduced-motion", () => {
    expect(blockSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
