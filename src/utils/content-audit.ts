export interface ContentIssue {
  file: string;
  line: number;
  rule: string;
  value: string;
}

const EXCLUDED_PATHS = ['src/data/qa/', 'src/pages/qa/', '.audit-baseline.json'];

export function isExcluded(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  return EXCLUDED_PATHS.some((excludedPath) => normalized.startsWith(excludedPath));
}

export interface PlaceholderPattern {
  rule: string;
  patterns: RegExp[];
}

const POLISH_CONTENT_PATHS = ['src/data/global/', 'src/data/navigation/', 'src/data/pages/', 'src/data/sections/'];
const POLISH_CONTENT_GLOB = [
  'src/pages/**/*.astro',
  'src/content/**/*.md',
  'src/content/**/*.mdoc',
  'src/config/site.ts',
  'src/config/template.ts',
  'site.config.mjs',
];

// These patterns identify ASCII spellings that require Polish diacritics.
// WARNING: do not add markers for words that are correct without diacritics
// (e.g. "cena") or for English words that look similar (e.g. "center",
// "process"). Each false positive makes the content audit noisy and untrusted.
// Keep one pattern per line so reviews can see exactly what changed.
const ASCII_POLISH_MARKERS = [
  // Services, contact, messages.
  /\buslug[aięy]?\b/i,
  /\bsprawdz\b/i,
  /\bwysylk[iaę]?\b/i,
  /\bwyslij\b/i,
  /\bwiadomosci\b/i,
  /\bobslug[aięy]?\b/i,
  // Company activity.
  /\bzajmujemy\s+sie\b/i,
  /\bwdrozeni[ae]?\b/i,
  /\bwdroz\w*\b/i,
  /\bzaleznosc[i]?\b/i,
  /\bplatnosc[i]?\b/i,
  /\bbezplatn[ey]?\b/i,
  /\bzobowiaz\w*\b/i,
  // Descriptions: size, quality, time.
  /\bglown[ayey]?\b/i,
  /\bglown[ae]j\b/i,
  /\bczest[oay]?\b/i,
  /\bczesciej\b/i,
  /\bwiekszosc\b/i,
  /\bwieksz[ayey]?\b/i,
  /\bjakosc[i]?\b/i,
  /\bdzieki\b(?=\s|$)/i,
  /\bwiecej\b/i,
  /\bmiedzy\b/i,
  /\bpozniej\b/i,
  /\bpozniejsz[ayey]?\b/i,
  /\bprzyszlosc\b/i,
  /\bprzyszly\w*\b/i,
  // Cooperation, services rendered.
  /\bprowadz[aey]c\w*\b/i,
  /\bwspolprac[ay]?\b/i,
  /\bswiadcz\w*\b/i,
  /\bosiagn[ąće]?\b/i,
  /\bzapewni\w*[c]?\b/i,
  /\bdzial[ay]my\b/i,
  /\bdzialaln[ośc]+\b/i,
  /\bprzyklad\w*\b/i,
  /\bpoczatk\w*\b/i,
  /\bkoncow[ayey]?\b/i,
  /\bczesci\b/i,
  /\bczesc\b(?!\w)/i,
  /\bnieruchomosci\b/i,
  /\bdziekuj\w*\b/i,
  /\bzespol\b(?!\w)/i,
  /\bzrodl[oałye]?\b/i,
  /\bwszystk[i]?\b/i,
  /\bcalosc[i]?\b/i,
  /\bilosc[i]?\b/i,
  /\bzyci[ey]?\b(?!\w)/i,
  /\bzyczeni[ae]?\b/i,
  /\bladn[ayey]?\b/i,
  /\bmilosc[i]?\b/i,
  /\bsil[ayę]?\b/i,
  // Speech, precision, documents.
  /\bmowi[ćc]?\b/i,
  /\bmowimy\b/i,
  /\bmowia\b/i,
  /\bciagl[ayey]?\b/i,
  /\bscisl[ey]?\b/i,
  /\bswiadectw\w*\b/i,
  /\bswiet[oa]?\b/i,
  /\bslubn\w*\b/i,
  /\bslubem\b/i,
  /\bksiazk[aię]?\b/i,
  /\bzaden\b/i,
  /\bzadn[ayey]?\b/i,
  /\bprzedstawi[ćc]\b/i,
  /\brzeczywiscie\b/i,
  /\brozwiaz\w*\b/i,
  /\bsprzet\w*\b/i,
  /\bdotycz[aey]c[e]?\b/i,
  /\bwlasciw[ey]?\b/i,
  /\bzloz\w*\b/i,
  /\bpolo\w*[zł]\w*\b/i,
  /\bnalez[yąe]?\b/i,
  /\bnajczesciej\b/i,
  // Users, usage, possibility.
  /\buzytkownik\w*\b/i,
  /\buzywa\w*\b/i,
  /\buzyc\b(?!h)/i,
  /\bmozliwosci\b/i,
  /\bmozliwosc\b/i,
  /\bkorzysc\b/i,
  /\bkorzysci\b/i,
  /\bbezpieczenstw\w*\b/i,
  /\bdoswiadczeni[ae]?\b/i,
  /\bzaangazowani[ae]?\b/i,
  /\bprosb[ayę]?\b/i,
  /\bzdjeci[ae]?\b/i,
  /\brozn[ayeych]?\b/i,
  /\bnarzedzi\w*\b/i,
  /\bzamowieni[ae]?\b/i,
  /\bwazn[ayey]?\b/i,
  /\bkazd[ayey]?\b/i,
  /\bszczescie\b/i,
  /\bzwierz[etę]?\b/i,
  /\bzelazn\w*\b/i,
  /\bzolwi\w*\b/i,
  /\bzolwia\b/i,
];

const POLISH_DIACRITICS = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

function isPolishContentPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  if (POLISH_CONTENT_PATHS.some((prefix) => normalized.startsWith(prefix))) return true;
  return POLISH_CONTENT_GLOB.some((pattern) => {
    const regex = new RegExp('^' + pattern.replace(/\//g, '/').replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
    return regex.test(normalized);
  });
}

function extractTextFromHtml(html: string): string[] {
  const texts: string[] = [];
  const tagContent = />([^<]+)</g;
  let match: RegExpExecArray | null;
  while ((match = tagContent.exec(html)) !== null) {
    const trimmed = match[1].trim();
    if (trimmed.length > 2) texts.push(trimmed);
  }
  return texts;
}

function getQuotedTextCandidates(source: string): Array<{ value: string; index: number }> {
  const candidates: Array<{ value: string; index: number }> = [];
  const quotedString = /"(?:\\.|[^"\\])*"/g;
  let match: RegExpExecArray | null;
  while ((match = quotedString.exec(source)) !== null) {
    try {
      const value = JSON.parse(match[0]);
      if (typeof value === 'string') candidates.push({ value, index: match.index });
    } catch {
      // Some Astro values are not valid JSON literals.
    }
  }
  return candidates;
}

export const PLACEHOLDER_PATTERNS: PlaceholderPattern[] = [
  { rule: 'example-email', patterns: [/kontakt@example\.com/i, /example\.com/i, /example\.org/i, /twojastrona\.pl/i] },
  { rule: 'placeholder-phone', patterns: [/\+48\s*123\s*456\s*789/] },
  { rule: 'placeholder-address', patterns: [/ul\.\s*Przyk[lł]adowa/i] },
  { rule: 'placeholder-name', patterns: [/^Nazwa strony$/m, /"Nazwa strony"/i] },
  { rule: 'placeholder-company', patterns: [/^Twoja Firma$/m, /Twoja Firma/i] },
  { rule: 'placeholder-tagline', patterns: [/^Krotki opis$/m, /Krótki opis/i] },
  { rule: 'placeholder-social-href', patterns: [ /"facebook":\s*"#"/, /"instagram":\s*"#"/, /"twitter":\s*"#"/, /"linkedin":\s*"#"/, /"youtube":\s*"#"/ ] },
  { rule: 'placeholder-twitter-handle', patterns: [ /"twitterHandle":\s*"@"/ ] },
  { rule: 'placeholder-text', patterns: [ /:\s*"[^"]*placeholder[^"]*"/i ] },
];

export function auditContent(source: string, filePath: string): ContentIssue[] {
  const issues: ContentIssue[] = [];
  if (isExcluded(filePath)) return issues;

  for (const patternDef of PLACEHOLDER_PATTERNS) {
    for (const regex of patternDef.patterns) {
      const globalRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
      let match: RegExpExecArray | null;
      while ((match = globalRegex.exec(source)) !== null) {
        const line = source.slice(0, match.index).split('\n').length;
        if (!issues.some((issue) => issue.file === filePath && issue.line === line && issue.rule === patternDef.rule)) {
          issues.push({ file: filePath, line, rule: patternDef.rule, value: match[0] });
        }
      }
    }
  }

  if (!isPolishContentPath(filePath)) return issues;
  const candidates = filePath.endsWith('.json') ? getQuotedTextCandidates(source) : extractTextFromHtml(source);
  for (const candidate of candidates) {
    const value = typeof candidate === 'string' ? candidate : candidate.value;
    const index = typeof candidate === 'string' ? -1 : candidate.index;
    if (POLISH_DIACRITICS.test(value)) continue;
    if (value.startsWith('/') || value.startsWith('./') || value.startsWith('http')) continue;
    if (!ASCII_POLISH_MARKERS.some((pattern) => pattern.test(value))) continue;
    const line = index >= 0 ? source.slice(0, index).split('\n').length : 1;
    if (!issues.some((issue) => issue.file === filePath && issue.line === line && issue.rule === 'polish-diacritics')) {
      issues.push({ file: filePath, line, rule: 'polish-diacritics', value });
    }
  }
  return issues;
}
