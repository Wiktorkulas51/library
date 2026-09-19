import { execSync } from 'node:child_process';

interface QaStep {
  name: string;
  command: string;
  description: string;
}

const STANDARD_STEPS: QaStep[] = [
  { name: 'npm run test', command: 'npm run test -- --run', description: 'Wszystkie testy jednostkowe i kontraktowe' },
  { name: 'npm run check:types', command: 'npm run check:types', description: 'Diagnostyka TypeScript i komponentów Astro' },
  { name: 'npm run check:hardcoded', command: 'npm run check:hardcoded', description: 'Brak treści klienta zaszytej w komponentach' },
  { name: 'npm run check:imports', command: 'npm run check:imports', description: 'Importy między katalogami używają aliasów' },
  { name: 'npm run check:registrations', command: 'npm run check:registrations', description: 'Spójność manifestu, rejestru i plików komponentów' },
  { name: 'npm run check:atomic', command: 'npm run check:atomic', description: 'Blokujące reguły Atomic Design' },
  { name: 'npm run check:motion', command: 'npm run check:motion', description: 'Brak wycofanych tokenów animacji' },
  { name: 'npm run check:icons', command: 'npm run check:icons', description: 'Spójność używanych ikon' },
  { name: 'npm run check:data', command: 'npm run check:data', description: 'Kontrakty danych sekcji i stron' },
  { name: 'npm run test:mobile', command: 'npm run test:mobile', description: 'Testy reguł audytu mobilnego' },
  { name: 'npm run check:mobile', command: 'npm run check:mobile', description: 'Audyt mobilny bez nowych naruszeń' },
  { name: 'npm run build', command: 'npm run build', description: 'Build produkcyjny' },
  { name: 'npm run check:build-output', command: 'npm run check:build-output', description: 'Brak stron i odnośników developerskich w wyniku produkcyjnym' },
  { name: 'npm run check:links', command: 'npm run check:links', description: 'Linki, trasy, nagłówki i akcje formularzy' },
  { name: 'npm run check:page-registry', command: 'npm run check:page-registry', description: 'Konfiguracje stron i warianty rejestru' },
  { name: 'npm run check:images', command: 'npm run check:images', description: 'Obrazy i fallback SmartImage' },
];

const STRICT_STEPS = STANDARD_STEPS.map((step) =>
  step.name === 'npm run check:mobile'
    ? { ...step, name: 'npm run check:mobile -- --strict', command: 'npm run check:mobile -- --strict', description: 'Audyt mobilny bez wyjątków legacy' }
    : step,
);

const MODES: Record<string, { name: string; steps: QaStep[] }> = {
  qa: {
    name: 'Standard QA',
    steps: STANDARD_STEPS,
  },
  strict: {
    name: 'Strict QA',
    steps: STRICT_STEPS,
  },
};

function runStep(step: QaStep): boolean {
  const separator = '\n' + '='.repeat(72) + '\n';
  console.log(separator);
  console.log(`  KROK: ${step.name}`);
  console.log(`  CEL:  ${step.description}`);
  console.log(separator);

  try {
    const output = execSync(step.command, {
      stdio: 'inherit',
      cwd: process.cwd(),
      timeout: 120_000,
    });
    console.log(`\n  [OK] ${step.name} — zakonczone kodem 0\n`);
    return true;
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    console.log(`\n  [FAIL] ${step.name} — zakonczone kodem ${status ?? 'unknown'}\n`);
    return false;
  }
}

function showHelp(): void {
  const lines = [
    '',
    '  ============================================================',
    '  ˚  UI Library — System uruchamiania QA',
    '  ============================================================',
    '',
    '  DOSTEPNE KOMENDY:',
    '',
    `  npm run qa          Standardowy gate: testy + checki + build (${STANDARD_STEPS.length} kroków)`,
    '  npm run verify      Alias bramki QA dla lokalnego developmentu i CI',
    '  npm run qa:strict   Jak qa, ale check:mobile w trybie strict',
    '  npm run qa:help     Ta pomoc',
    '',
    '  PROFIL ZALECEN:',
    '',
    '  qa         — po kazdej zmianie UI (najczestszy wybor)',
    '  qa:strict  — przed mergem do mastera, wymaga 0 known legacy',
    '',
    '  WAZNE:',
    '',
    '  - Biblioteka jest katalogiem komponentow. Dane klientow nie sa',
    '    kryterium zaliczenia lokalnej bramki QA.',
    '  - Fixture QA: /qa/mobile-fixture/',
    '  - Po kazdej zmianie UI uruchom npm run qa.',
    '  - Nie uznawaj zadania za zakonczone bez wyniku npm run qa.',
    '',
    '  RECZNE TESTY POZA AUTOMATEM:',
    '',
    '  - Focus trap draweru (Tab, Shift+Tab, Escape)',
    '  - Lenis po przejsciu miedzy stronami',
    '  - Overflow przy 320px, 375px, 390px, 414px',
    '  - Dzialanie kotwic (#contact)',
    '',
    '  ============================================================',
    '',
  ];
  console.log(lines.join('\n'));
  process.exit(0);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('help')) {
    showHelp();
    return;
  }

  const modeArg = args.find((a) => !a.startsWith('--')) || 'qa';
  const mode = MODES[modeArg];

  if (!mode) {
    console.error(`Nieznany profil QA: "${modeArg}". Dostepne: ${Object.keys(MODES).join(', ')}`);
    process.exit(1);
  }

  const startTime = Date.now();

  console.log(`\n  >>> Rozpoczynam: ${mode.name} <<<\n`);

  let passed = 0;
  let failed = 0;

  for (const step of mode.steps) {
    const ok = runStep(step);
    if (ok) {
      passed += 1;
    } else {
      failed += 1;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const total = mode.steps.length;

  console.log('='.repeat(72));
  console.log(`  PODSUMOWANIE: ${mode.name}`);
  console.log('='.repeat(72));
  console.log(`  Zakonczone: ${passed}/${total}  Bledy: ${failed}  Czas: ${elapsed}s`);

  if (failed > 0) {
    console.log(`\n  >>> NIE ZALICZONE <<<\n`);
    process.exit(1);
  } else {
    console.log(`\n  >>> ZALICZONE <<<\n`);
    process.exit(0);
  }
}

main();
