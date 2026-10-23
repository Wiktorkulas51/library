import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import { auditLinks, buildRouteMap } from '@utils/link-audit';
import { isDesignOnlyPath } from '@utils/design-only';

const scanPatterns = [
  'src/components/**/*.astro',
  'src/pages/**/*.astro',
  'src/data/**/*.json',
  'src/config/template.ts',
  'src/layouts/**/*.astro',
];

const excludePatterns = [
  '**/node_modules/**',
  'src/data/qa/**',
  'src/data/dev/**',
  'src/pages/qa/**',
  'src/pages/dev/**',
  'src/pages/_disabled/**',
  '.audit-baseline.json',
];

let targets: string[] = scanPatterns.flatMap((pattern) =>
  fg.sync(pattern, { ignore: excludePatterns }),
);
targets = targets.filter((target) => !isDesignOnlyPath(target));

const routes = buildRouteMap();
const distDir = path.resolve('dist');
if (fs.existsSync(distDir)) {
  const distHtml = fg.sync('**/*.html', {
    cwd: distDir,
    ignore: ['**/qa/**', '**/dev/**'],
  });

  // Build output supplies concrete dynamic routes, but is audited separately by
  // check:build-output. Scanning it here would treat component fixtures as pages.
  for (const file of distHtml) {
    const route = `/${file.replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '')}`;
    routes.validRoutes.add(route === '/' ? '/' : route.replace(/\/$/, ''));
  }
}

let totalIssues = 0;

for (const relativePath of targets) {
  const filePath = path.resolve(relativePath);
  if (!fs.existsSync(filePath)) continue;

  const source = fs.readFileSync(filePath, 'utf8');
  const issues = auditLinks(source, relativePath, routes);

  for (const issue of issues) {
    totalIssues += 1;
    console.error(
      `${issue.file}:${issue.line} [${issue.rule}] ${issue.message}`,
    );
  }
}

if (totalIssues > 0) {
  console.error(`\ncheck:links: ${totalIssues} link issue(s) detected.`);
  process.exitCode = 1;
} else {
  console.log(`check:links: No link issues detected (${targets.length} file(s) scanned).`);
}
