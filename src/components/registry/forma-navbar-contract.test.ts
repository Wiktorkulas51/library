import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import navbarData from "../../data/sections/forma-navbar.json";

// Why: Blok przenosi navbar Forma do biblioteki. Test pilnuje, że postęp przewijania
// idzie przez wspólny skrypt, menu mobilne jest w osobnym pliku, a klasy nie wyciekają
// (np. .navbar, .menu-toggle), bo biblioteka ma własne globalne style.
const blockSource = fs.readFileSync(path.resolve(import.meta.dirname, "forma/FormaNavbarBlock.astro"), "utf8");
const menuScript = fs.readFileSync(path.resolve(import.meta.dirname, "../../../public/js/forma-navbar.js"), "utf8");
const wordmarkPath = path.resolve(import.meta.dirname, "../../../public/images/library/forma/forma-wordmark.png");

describe("FormaNavbarBlock", () => {
  it("oznacza root do wspólnego skryptu postępu z dystansem 220", () => {
    expect(blockSource).toMatch(/<header[\s\S]*data-header-progress\s*\n\s*data-header-progress-distance="220"/);
  });

  it("ładuje skrypt postępu i menu z data-astro-rerun", () => {
    expect(blockSource).toContain('<script is:inline data-astro-rerun src="/js/header-scroll-progress.js"></script>');
    expect(blockSource).toContain('<script is:inline data-astro-rerun src="/js/forma-navbar.js"></script>');
  });

  it("nie kopiuje logiki postępu z SiteNavbar", () => {
    expect(blockSource).not.toContain("--nav-scroll-progress\", current");
    expect(blockSource).not.toContain("requestAnimationFrame");
  });

  it("nie używa generycznych nazw klas z oryginału", () => {
    const genericSelector = /(^|[\s,(])\.(navbar|menu-toggle|mobile-menu|wordmark|nav-cta|mobile-cta|desktop-nav|language-switch|arrow-loop)\b/m;
    expect(blockSource).not.toMatch(genericSelector);
    expect(blockSource).not.toMatch(/class="(navbar|menu-toggle|mobile-menu|wordmark|nav-cta|mobile-cta)"/);
  });

  it("zawiera tokeny Forma na korzeniu bloku", () => {
    expect(blockSource).toContain("--color-brand-primary: #d07a3b;");
    expect(blockSource).toContain("--color-brand-dark: #22221f;");
    expect(blockSource).toContain("--color-brand-light: #f3f0e9;");
    expect(blockSource).toContain("--home-frame-gutters: 2rem;");
  });

  it("zachowuje obsługę prefers-reduced-motion", () => {
    expect(blockSource).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("dane z JSON mają logo w katalogu biblioteki i poprawne linki", () => {
    expect(navbarData.logoSrc).toBe("/images/library/forma/forma-wordmark.png");
    expect(fs.existsSync(wordmarkPath)).toBe(true);
    expect(navbarData.links).toHaveLength(3);
    navbarData.links.forEach((link) => expect(link.href.startsWith("/")).toBe(true));
    expect(navbarData.cta.href).toBe("/#kontakt");
  });

  it("menu mobilne ma idempotentne czyszczenie słuchaczy i nie kopiuje postępu", () => {
    expect(menuScript).toContain("window.__formaNavbarCleanup");
    expect(menuScript).toContain("removeEventListener");
    expect(menuScript).toContain("Escape");
    expect(menuScript).not.toContain("--nav-scroll-progress");
  });
});
