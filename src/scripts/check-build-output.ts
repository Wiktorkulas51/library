import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import { BUILD_SCOPE } from '../../site.config.mjs';

const distDir = path.resolve('dist');
const errors: string[] = [];

if (!fs.existsSync(distDir)) {
  errors.push('Brak katalogu dist. Najpierw uruchom npm run build.');
} else {
  const forbiddenSegments = new Set([
    ...BUILD_SCOPE.forceRemove,
    'admin',
    'studio',
  ]);

  for (const entry of fs.readdirSync(distDir, { withFileTypes: true })) {
    if (entry.isDirectory() && forbiddenSegments.has(entry.name)) {
      errors.push(`Wynik produkcyjny zawiera niedozwolony katalog dist/${entry.name}/.`);
    }
  }

  const htmlFiles = fg.sync('**/*.html', {
    cwd: distDir,
    ignore: ['**/404.html'],
  });

  for (const relativePath of htmlFiles) {
    const filePath = path.join(distDir, relativePath);
    const source = fs.readFileSync(filePath, 'utf8');
    if (source.includes('href="/dev/components/"')) {
      errors.push(`Wynik produkcyjny zawiera odnośnik developerski: dist/${relativePath}.`);
    }
  }
}

const disabledDir = path.resolve('src/pages/_disabled');
if (fs.existsSync(disabledDir)) {
  const disabledFiles = fg.sync('**/*', { cwd: disabledDir, onlyFiles: true });
  if (disabledFiles.length > 0) {
    errors.push(`src/pages/_disabled/ nie jest pusty po buildzie (${disabledFiles.length} plików).`);
  }
}

if (errors.length > 0) {
  console.error(`check:build-output: ${errors.length} issue(s) detected.`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('check:build-output: wynik produkcyjny jest czysty.');
