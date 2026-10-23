// Robi statyczne zrzuty miniatur katalogu do public/component-thumbnails/.
// Dlaczego: miniatury jako iframe to pełna strona Astro na tym samym wątku co katalog,
// więc każde ładowanie przy przewijaniu gubiło klatki. Obraz WebP nie kosztuje nic.
//
// Użycie (dev server biblioteki musi działać):
//   npm run thumbs:capture                 tylko brakujące zrzuty
//   npm run thumbs:capture -- --all        wszystkie od nowa
//   npm run thumbs:capture -- --only=alanHeader,footer   wybrane sekcje
//   npm run thumbs:capture -- --base=http://127.0.0.1:4324
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const args = process.argv.slice(2);
const readArg = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const base = (readArg('base') || 'http://127.0.0.1:4324').replace(/\/$/, '');
const captureAll = args.includes('--all');
const only = (readArg('only') || '').split(',').map((value) => value.trim()).filter(Boolean);
const outputDir = path.resolve('public/component-thumbnails');
const artboard = { width: 1440, height: 900 };
const output = { width: 720, height: 450, quality: 72 };
const concurrency = 4;

// Nazwa pliku musi być taka sama jak w ComponentGallery.astro (thumbnailFileName).
const fileNameFor = (section, variant) => `${section}--${variant}.webp`;

async function readCatalogUrls() {
  const response = await fetch(`${base}/`);
  if (!response.ok) throw new Error(`Katalog nie odpowiada: ${base}/ (${response.status})`);
  const html = await response.text();
  const urls = [...html.matchAll(/data-thumbnail-src="([^"]+)"/g)].map((match) => match[1]);
  return [...new Set(urls)].map((url) => {
    const [, section, variant] = url.match(/\/components\/thumbnail\/([^/]+)\/([^/]+)\//) || [];
    return { url, section: decodeURIComponent(section), variant: decodeURIComponent(variant) };
  }).filter((item) => item.section && item.variant);
}

async function capture(context, item) {
  const page = await context.newPage();
  try {
    await page.goto(`${base}${item.url}`, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(() => document.fonts?.ready);
    // Wyspy React (np. komponenty 21st.dev) hydratują się po load. Astro zdejmuje atrybut ssr
    // po hydratacji, więc czekamy, aż zniknie, żeby nie złapać pustej klatki.
    await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'), null, { timeout: 20000 }).catch(() => {});
    // Komponenty sterowane scrollem układają elementy dopiero po zdarzeniu scroll albo resize.
    await page.evaluate(() => {
      window.scrollTo(0, 1);
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
    });
    // Czas na obrazy ładowane leniwie i wejściowe animacje bloków.
    await page.waitForTimeout(700);
    const png = await page.screenshot({ clip: { x: 0, y: 0, ...artboard } });
    const target = path.join(outputDir, fileNameFor(item.section, item.variant));
    // Pusta klatka (jednolite tło) nic nie mówi o komponencie. Nie zapisujemy jej,
    // więc galeria pokaże dla niego żywy iframe.
    const { channels } = await sharp(png).stats();
    if (channels.every((channel) => channel.stdev < 1.5)) {
      fs.rmSync(target, { force: true });
      return false;
    }
    await sharp(png)
      .resize(output.width, output.height)
      .webp({ quality: output.quality })
      .toFile(target);
    return true;
  } finally {
    await page.close();
  }
}

const items = (await readCatalogUrls()).filter((item) => (
  (!only.length || only.includes(item.section))
  && (captureAll || only.length || !fs.existsSync(path.join(outputDir, fileNameFor(item.section, item.variant))))
));

fs.mkdirSync(outputDir, { recursive: true });
if (!items.length) {
  console.log('thumbs:capture: brak miniatur do zrobienia.');
  process.exit(0);
}

console.log(`thumbs:capture: ${items.length} miniatur z ${base}`);
const browser = await chromium.launch();
// Reduced motion daje końcowy stan animacji wejścia zamiast pustej klatki.
const context = await browser.newContext({ viewport: artboard, reducedMotion: 'reduce' });
const failures = [];
const blanks = [];
let done = 0;
const queue = [...items];

await Promise.all(Array.from({ length: concurrency }, async () => {
  while (queue.length) {
    const item = queue.shift();
    try {
      if (!(await capture(context, item))) blanks.push(`${item.section}/${item.variant}`);
    } catch (error) {
      failures.push(`${item.section}/${item.variant}: ${error.message.split('\n')[0]}`);
    }
    done += 1;
    if (done % 25 === 0 || done === items.length) console.log(`  ${done}/${items.length}`);
  }
}));

await browser.close();
if (blanks.length) console.log(`thumbs:capture: puste klatki, zostaje żywy iframe: ${blanks.join(', ')}`);
if (failures.length) {
  console.error(`thumbs:capture: ${failures.length} błędów:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('thumbs:capture: gotowe.');
