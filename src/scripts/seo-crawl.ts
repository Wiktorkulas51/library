import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import { parse } from "parse5";

type IssueLevel = "error" | "warning" | "info";
type Issue = { level: IssueLevel; code: string; message: string; target?: string };
type PageReport = {
	url: string;
	status: number | null;
	finalUrl: string;
	contentType: string;
	responseTimeMs: number;
	canonical: string | null;
	indexable: boolean;
	title: string | null;
	description: string | null;
	h1Count: number;
	h1: string[];
	headings: number[];
	lang: string | null;
	hreflang: { lang: string; url: string }[];
	jsonLdTypes: string[];
	links: string[];
	images: number;
	issues: Issue[];
	foundFrom: string[];
};

type CrawlReport = {
	run: { startedAt: string; baseUrl: string; pagesDiscovered: number; pagesCrawled: number; durationMs: number };
	summary: { errors: number; warnings: number; info: number; passed: boolean };
	global: { robots: { status: string; issues: Issue[] }; sitemap: { status: string; issues: Issue[] } };
	pages: PageReport[];
	duplicates: { titles: string[]; descriptions: string[]; h1: string[] };
	orphanPages: string[];
};

type Node = { nodeName?: string; tagName?: string; attrs?: { name: string; value: string }[]; childNodes?: Node[]; value?: string };

const TRACKING_QUERY_PARAMETER = /^(utm_[^=]+|gclid|fbclid|msclkid|mc_cid|mc_eid)$/i;
// Starter Kit nie zakłada z góry domeny produkcyjnej ani zewnętrznych wersji językowych.
const TRUSTED_SITE_ORIGINS = new Set<string>();
const ACCEPTED_WARNING_CODES = new Set<string>();

const rootDir = process.cwd();
const reportsDir = join(rootDir, "audit-reports", "seo-crawl");
const maxPages = readArg("--max-pages") ? Number(readArg("--max-pages")) : 500;
const baseUrl = new URL(readArg("--base-url") ?? process.env.SEO_BASE_URL ?? "http://127.0.0.1:4321/");
baseUrl.hash = "";

function readArg(name: string) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

function attr(node: Node, name: string) {
	return node.attrs?.find((item) => item.name.toLowerCase() === name.toLowerCase())?.value ?? null;
}

function walk(node: Node, callback: (node: Node) => void) {
	callback(node);
	for (const child of node.childNodes ?? []) walk(child, callback);
}

function text(node: Node): string {
	if (node.nodeName === "#text") return node.value ?? "";
	return (node.childNodes ?? []).map(text).join(" ").replace(/\s+/g, " ").trim();
}

export function normalizeUrl(value: string, source: URL) {
	let url: URL;
	try {
		url = new URL(value, source);
	} catch {
		return null;
	}
	url.hash = "";
	if (url.origin !== baseUrl.origin || !["http:", "https:"].includes(url.protocol)) return null;
	for (const key of [...url.searchParams.keys()]) if (TRACKING_QUERY_PARAMETER.test(key)) url.searchParams.delete(key);
	if (url.pathname !== "/" && !url.pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(url.pathname)) url.pathname += "/";
	return url;
}

function unique(values: string[]) {
	return [...new Set(values)];
}

async function fetchText(url: URL) {
	const started = Date.now();
	try {
		const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
		return { response, body: await response.text(), responseTimeMs: Date.now() - started };
	} catch (error) {
		return { response: null, body: "", responseTimeMs: Date.now() - started, error: String(error) };
	}
}

function sitemapUrls(xml: string, source: URL) {
	return unique(parseSitemapDocument(xml).locations.map((location) => localizeUrl(location, source)).filter(Boolean) as string[]);
}

function localizeUrl(value: string, source: URL) {
	let parsed: URL;
	try {
		parsed = new URL(value, source);
	} catch {
		return null;
	}
	if (parsed.origin !== baseUrl.origin && !TRUSTED_SITE_ORIGINS.has(parsed.origin)) return null;
	return normalizeUrl(`${parsed.pathname}${parsed.search}`, baseUrl)?.href ?? null;
}

export function parseSitemapDocument(xml: string) {
	const root = /<sitemapindex[\s>]/i.test(xml) ? "sitemapindex" : /<urlset[\s>]/i.test(xml) ? "urlset" : "unknown";
	const locations = unique([...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim()).filter(Boolean));
	return { root, locations };
}

function duplicateValues(values: Array<string | null>) {
	const counts = new Map<string, number>();
	for (const value of values.filter((item): item is string => Boolean(item))) counts.set(value, (counts.get(value) ?? 0) + 1);
	return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

function addIssue(issues: Issue[], level: IssueLevel, code: string, message: string, target?: string) {
	issues.push({ level, code, message, ...(target ? { target } : {}) });
}

function checkLength(value: string | null, min: number, max: number, label: string, issues: Issue[]) {
	if (!value) return;
	if (value.length < min || value.length > max) addIssue(issues, "warning", `${label}_length`, `${label} ma ${value.length} znaków, oczekiwano zakresu ${min} do ${max}.`);
}

export function parsePage(html: string, pageUrl: URL, status: number | null, finalUrl: string, contentType: string, responseTimeMs: number, foundFrom: string[], xRobotsTag: string | null): PageReport {
	const document = parse(html) as Node;
	const titles: string[] = [];
	const descriptions: string[] = [];
	const canonicals: string[] = [];
	const h1: string[] = [];
	const headings: number[] = [];
	const hreflang: { lang: string; url: string }[] = [];
	const jsonLdTypes: string[] = [];
	const links: string[] = [];
	const images: Node[] = [];
	const issues: Issue[] = [];
	let robots = xRobotsTag ?? "";
	let htmlLang: string | null = null;

	walk(document, (node) => {
		const tag = node.tagName?.toLowerCase();
		if (tag === "html") htmlLang = attr(node, "lang");
		if (tag === "title") titles.push(text(node));
		if (tag === "meta" && attr(node, "name")?.toLowerCase() === "description") descriptions.push(attr(node, "content") ?? "");
		if (tag === "meta" && attr(node, "name")?.toLowerCase() === "robots") robots = attr(node, "content") ?? "";
		if (tag === "link" && attr(node, "rel")?.toLowerCase() === "canonical") canonicals.push(attr(node, "href") ?? "");
		if (tag === "h1") h1.push(text(node));
		if (tag && /^h[1-6]$/.test(tag)) headings.push(Number(tag[1]));
		if (tag === "link" && attr(node, "rel")?.toLowerCase() === "alternate" && attr(node, "hreflang") && attr(node, "href")) {
			const alternate = normalizeUrl(attr(node, "href")!, pageUrl);
			if (alternate) hreflang.push({ lang: attr(node, "hreflang")!, url: alternate.href });
		}
		if (tag === "script" && attr(node, "type")?.toLowerCase() === "application/ld+json") {
			try {
				const validation = validateJsonLd(JSON.parse(text(node)));
				jsonLdTypes.push(...validation.types);
				for (const issue of validation.issues) addIssue(issues, issue.level, issue.code, issue.message);
			} catch {
				addIssue(issues, "error", "invalid_json_ld", "Nieprawidłowy JSON-LD.");
			}
		}
		if (tag === "a") {
			const target = attr(node, "href");
			if (target && normalizeUrl(target, pageUrl)) links.push(normalizeUrl(target, pageUrl)!.href);
		}
		if (tag === "img") images.push(node);
	});

	if (status === null || status >= 500 || status >= 400) addIssue(issues, "error", "http_status", status === null ? "Nie udało się pobrać strony." : `Strona zwróciła status HTTP ${status}.`);
	if (!contentType.toLowerCase().includes("text/html")) addIssue(issues, "error", "not_html", `Odpowiedź ma typ ${contentType || "nieznany"}, nie text/html.`);
	const title = titles[0] || null;
	const description = descriptions[0] || null;
	if (!title) addIssue(issues, "error", "missing_title", "Brak title.");
	checkLength(title, 30, 60, "title", issues);
	if (!description) addIssue(issues, "warning", "missing_description", "Brak meta description.");
	checkLength(description, 120, 160, "description", issues);
	if (titles.length > 1) addIssue(issues, "error", "multiple_title", "Strona ma więcej niż jeden title.");
	if (descriptions.length > 1) addIssue(issues, "warning", "multiple_description", "Strona ma więcej niż jedną meta description.");
	if (h1.length === 0) addIssue(issues, "error", "missing_h1", "Brak nagłówka H1.");
	if (h1.length > 1) addIssue(issues, "error", "multiple_h1", `Strona ma ${h1.length} nagłówki H1.`);
	for (let index = 1; index < headings.length; index++) if (headings[index] > headings[index - 1] + 1) addIssue(issues, "warning", "heading_skip", `Hierarchia nagłówków przeskakuje z H${headings[index - 1]} do H${headings[index]}.`);
	if (!htmlLang) addIssue(issues, "warning", "missing_lang", "Brak atrybutu lang na elemencie html.");
	if (canonicals.length !== 1) addIssue(issues, "error", "canonical_count", `Znaleziono ${canonicals.length} canonicali, oczekiwano dokładnie jednego.`);
	const canonical = canonicals[0] ? normalizeUrl(canonicals[0], pageUrl)?.href ?? canonicals[0] : null;
	if (robots.toLowerCase().includes("noindex") && !pageUrl.pathname.includes("form-success")) addIssue(issues, "warning", "noindex", "Strona ma noindex.");
	for (const image of images) {
		if (attr(image, "alt") === null) addIssue(issues, "warning", "image_missing_alt", "Obraz nie ma atrybutu alt.");
	}

	return { url: pageUrl.href, status, finalUrl, contentType, responseTimeMs, canonical, indexable: !robots.toLowerCase().includes("noindex"), title, description, h1Count: h1.length, h1, headings, lang: htmlLang, hreflang, jsonLdTypes: unique(jsonLdTypes), links: unique(links), images: images.length, issues, foundFrom };
}

type JsonLdValidationIssue = { level: IssueLevel; code: string; message: string };

function jsonLdNodes(value: unknown, inheritedContext?: unknown): Array<{ node: Record<string, any>; context: unknown }> {
	if (Array.isArray(value)) return value.flatMap((item) => jsonLdNodes(item, inheritedContext));
	if (!value || typeof value !== "object") return [];
	const node = value as Record<string, any>;
	const context = node["@context"] ?? inheritedContext;
	if (node["@graph"]) return jsonLdNodes(node["@graph"], context);
	return [{ node, context }];
}

function isSchemaContext(value: unknown) {
	if (typeof value === "string") return value === "https://schema.org" || value === "http://schema.org";
	if (!value || typeof value !== "object") return false;
	const vocab = (value as Record<string, unknown>)["@vocab"];
	return typeof vocab === "string" && /schema\.org\/?$/i.test(vocab);
}

function nonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function absoluteHttpUrl(value: unknown) {
	if (!nonEmptyString(value)) return false;
	try {
		const parsed = new URL(value);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

function valueHasUrl(value: unknown) {
	if (absoluteHttpUrl(value)) return true;
	if (Array.isArray(value)) return value.length > 0 && value.some(valueHasUrl);
	if (!value || typeof value !== "object") return false;
	const object = value as Record<string, unknown>;
	return absoluteHttpUrl(object["@id"]) || absoluteHttpUrl(object.url);
}

function jsonLdTypeNames(value: unknown) {
	if (typeof value === "string" && value.trim()) return [value.trim()];
	if (Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim())) return value.map((item) => item.trim());
	return [];
}

function validateJsonLdValue(node: Record<string, any>, type: string): JsonLdValidationIssue[] {
	const issues: JsonLdValidationIssue[] = [];
	const requireString = (field: string) => {
		if (!nonEmptyString(node[field])) issues.push({ level: "error", code: "json_ld_missing_field", message: `JSON-LD ${type} nie ma tekstowego pola ${field}.` });
	};
	const requireUrl = (field: string) => {
		if (!valueHasUrl(node[field])) issues.push({ level: "error", code: "json_ld_invalid_url", message: `JSON-LD ${type} ma nieprawidłowy adres w polu ${field}.` });
	};

	if (["Article", "BlogPosting", "NewsArticle"].includes(type)) {
		requireString("headline");
		requireString("datePublished");
		if (nonEmptyString(node.datePublished) && Number.isNaN(Date.parse(node.datePublished))) issues.push({ level: "error", code: "json_ld_invalid_date", message: `JSON-LD ${type} ma nieprawidłową datę datePublished.` });
		if (!nonEmptyString(node.author) && !(node.author && typeof node.author === "object" && nonEmptyString(node.author.name)) && !valueHasUrl(node.author)) issues.push({ level: "error", code: "json_ld_missing_field", message: `JSON-LD ${type} nie ma poprawnego pola author.` });
	}
	if (type === "BreadcrumbList") {
		if (!Array.isArray(node.itemListElement) || node.itemListElement.length === 0) issues.push({ level: "error", code: "json_ld_missing_field", message: "JSON-LD BreadcrumbList nie ma niepustej tablicy itemListElement." });
		for (const item of node.itemListElement ?? []) {
			if (!item || typeof item !== "object" || item["@type"] !== "ListItem") issues.push({ level: "error", code: "json_ld_invalid_breadcrumb", message: "Element BreadcrumbList nie ma typu ListItem." });
			if (!Number.isInteger(item?.position) || item.position < 1) issues.push({ level: "error", code: "json_ld_invalid_breadcrumb", message: "Element BreadcrumbList ma nieprawidłową pozycję." });
			if (!nonEmptyString(item?.name) || !valueHasUrl(item?.item)) issues.push({ level: "error", code: "json_ld_invalid_breadcrumb", message: "Element BreadcrumbList musi mieć nazwę i poprawny adres item." });
		}
	}
	if (type === "FAQPage") {
		if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) issues.push({ level: "error", code: "json_ld_missing_field", message: "JSON-LD FAQPage nie ma niepustej tablicy mainEntity." });
		for (const question of node.mainEntity ?? []) {
			if (question?.["@type"] !== "Question" || !nonEmptyString(question?.name)) issues.push({ level: "error", code: "json_ld_invalid_faq", message: "Element FAQPage musi być pytaniem z typem Question i nazwą." });
			if (question?.acceptedAnswer?.["@type"] !== "Answer" || !nonEmptyString(question?.acceptedAnswer?.text)) issues.push({ level: "error", code: "json_ld_invalid_faq", message: "Pytanie FAQPage musi mieć odpowiedź typu Answer z tekstem." });
		}
	}
	if (["Organization", "LocalBusiness", "ProfessionalService", "WebSite"].includes(type)) {
		requireString("name");
		requireUrl("url");
	}
	for (const field of ["url", "mainEntityOfPage", "logo", "image"]) if (node[field] !== undefined && !valueHasUrl(node[field])) issues.push({ level: "error", code: "json_ld_invalid_url", message: `JSON-LD ${type} ma nieprawidłowy adres w polu ${field}.` });
	return issues;
}

export function validateJsonLd(value: unknown): { types: string[]; issues: JsonLdValidationIssue[] } {
	const issues: JsonLdValidationIssue[] = [];
	const types: string[] = [];
	const nodes = jsonLdNodes(value);
	if (nodes.length === 0) return { types, issues: [{ level: "error", code: "invalid_json_ld_shape", message: "JSON-LD musi zawierać obiekt, tablicę obiektów albo @graph." }] };
	for (const { node, context } of nodes) {
		if (!isSchemaContext(context)) issues.push({ level: "error", code: "json_ld_invalid_context", message: "JSON-LD nie wskazuje poprawnego kontekstu schema.org." });
		const nodeTypes = jsonLdTypeNames(node["@type"]);
		if (nodeTypes.length === 0) {
			issues.push({ level: "error", code: "json_ld_invalid_type", message: "JSON-LD nie ma poprawnego pola @type." });
			continue;
		}
		types.push(...nodeTypes);
		for (const type of nodeTypes) issues.push(...validateJsonLdValue(node, type));
	}
	return { types: unique(types), issues };
}

async function main() {
	const startedAt = new Date().toISOString();
	const started = Date.now();
	const queue = new Map<string, string[]>();
	const visited = new Set<string>();
	const reports: PageReport[] = [];
	const sitemapIssues: Issue[] = [];
	const robotsIssues: Issue[] = [];
	const sitemapSet = new Set<string>();
	const visitedSitemaps = new Set<string>();

	for (const candidate of ["/sitemap-index.xml", "/sitemap.xml", "/sitemap-0.xml"]) {
		const url = new URL(candidate, baseUrl);
		if (await collectSitemap(url, visitedSitemaps, sitemapSet, sitemapIssues)) {
			for (const page of sitemapSet) queue.set(page, ["sitemap"]);
			break;
		}
	}
	if (queue.size === 0) addIssue(sitemapIssues, "error", "sitemap_unavailable", "Nie znaleziono działającej sitemap.");
	queue.set(baseUrl.href, unique([...(queue.get(baseUrl.href) ?? []), "root"]));

	const robots = await fetchText(new URL("/robots.txt", baseUrl));
	if (!robots.response || robots.response.status >= 400) addIssue(robotsIssues, "error", "robots_unavailable", "Nie udało się pobrać robots.txt.");
	else if (!robots.body.toLowerCase().includes("sitemap:")) addIssue(robotsIssues, "warning", "robots_missing_sitemap", "robots.txt nie zawiera dyrektywy Sitemap.");

	while (queue.size > 0 && visited.size < maxPages) {
		const [url, foundFrom] = queue.entries().next().value as [string, string[]];
		queue.delete(url);
		if (visited.has(url)) continue;
		visited.add(url);
		const pageUrl = new URL(url);
		const result = await fetchText(pageUrl);
		const finalUrl = result.response?.headers.get("location") ? new URL(result.response.headers.get("location")!, pageUrl).href : pageUrl.href;
		const contentType = result.response?.headers.get("content-type") ?? "";
		// Odpowiedzi nie-HTML (RSS, obrazy, pliki) pomijamy bez bledu.
		// Wczesniej parser HTML probowal je analizowac i zglaszal falszywe
		// bledy (brak H1, brak canonical) np. dla /blog/rss.xml.
		if (result.response && result.response.ok && !contentType.toLowerCase().includes("text/html")) {
			reports.push({
				url: pageUrl.href,
				status: result.response.status,
				finalUrl,
				contentType,
				responseTimeMs: result.responseTimeMs,
				canonical: null,
				indexable: false,
				title: null,
				description: null,
				h1Count: 0,
				h1: [],
				headings: [],
				lang: null,
				hreflang: [],
				jsonLdTypes: [],
				links: [],
				images: 0,
				issues: [{ level: "info", code: "skipped_non_html", message: `Pominieto kontrole tresci, typ odpowiedzi to ${contentType}.` }],
				foundFrom,
			});
			continue;
		}
		const report = parsePage(result.body, pageUrl, result.response?.status ?? null, finalUrl, contentType, result.responseTimeMs, foundFrom, result.response?.headers.get("x-robots-tag") ?? null);
		for (const issue of report.issues) {
			if (issue.level === "warning" && ACCEPTED_WARNING_CODES.has(issue.code)) {
				issue.level = "info";
				issue.message = `Zaakceptowane ryzyko: ${issue.message}`;
			}
		}
		if (report.canonical) {
			let canonicalParsed: URL | null = null;
			try {
				canonicalParsed = new URL(report.canonical, pageUrl);
			} catch {
				addIssue(report.issues, "error", "canonical_invalid_url", `Canonical ma nieprawidłowy adres: ${report.canonical}.`);
			}
			const canonicalUrl = canonicalParsed ? localizeUrl(canonicalParsed.href, pageUrl) : null;
			if (canonicalParsed && !canonicalUrl) addIssue(report.issues, "info", "canonical_external_target", `Canonical wskazuje na niepowiązaną domenę ${canonicalParsed.origin}.`);
			else if (canonicalUrl) {
				if (canonicalUrl !== pageUrl.href) addIssue(report.issues, "warning", "canonical_target", `Canonical wskazuje na ${new URL(canonicalUrl).pathname}.`);
				const canonicalResult = await fetchText(new URL(canonicalUrl));
				if (!canonicalResult.response || canonicalResult.response.status >= 400) addIssue(report.issues, "error", "canonical_unreachable", `Canonical nie zwraca poprawnego statusu: ${report.canonical}.`);
			}
		}
		if (result.response && result.response.status >= 300 && result.response.status < 400) addIssue(report.issues, "warning", "redirect", `Strona przekierowuje do ${finalUrl}.`);
		for (const link of report.links) if (!visited.has(link) && !queue.has(link)) queue.set(link, [pageUrl.pathname]);
		reports.push(report);
	}

	const incomingLinks = new Map(reports.map((page) => [page.url, 0]));
	for (const page of reports) for (const link of page.links) incomingLinks.set(link, (incomingLinks.get(link) ?? 0) + 1);
	for (const page of reports) {
		if (page.url !== baseUrl.href && (incomingLinks.get(page.url) ?? 0) === 0) addIssue(page.issues, "warning", "orphan_page", "Strona nie ma żadnego linku wewnętrznego.");
		if (sitemapSet.has(page.url) && !page.indexable && !page.url.includes("form-success")) addIssue(page.issues, "warning", "sitemap_noindex", "Adres znajduje się w sitemap, ale ma noindex.");
		const seenHreflangLanguages = new Set<string>();
		for (const alternate of page.hreflang) {
			const language = normalizeLanguage(alternate.lang);
			if (seenHreflangLanguages.has(language)) addIssue(page.issues, "warning", "hreflang_duplicate_language", `Strona ma więcej niż jeden hreflang dla języka ${alternate.lang}.`);
			seenHreflangLanguages.add(language);
		}
		for (const alternate of page.hreflang) {
			const target = reports.find((candidate) => candidate.url === alternate.url);
			if (!target) addIssue(page.issues, "warning", "hreflang_target_missing", `Hreflang ${alternate.lang} wskazuje na nieprzeskanowany adres ${alternate.url}.`);
			else {
				const reciprocal = target.hreflang.find((back) => back.url === page.url);
				if (!reciprocal) addIssue(page.issues, "warning", "hreflang_not_reciprocal", `Hreflang ${alternate.lang} nie ma wzajemnego wskazania.`);
				else if (page.lang && normalizeLanguage(reciprocal.lang) !== normalizeLanguage(page.lang)) addIssue(page.issues, "warning", "hreflang_reciprocal_lang_mismatch", `Wzajemny hreflang wskazuje język ${reciprocal.lang}, a strona źródłowa ma lang=${page.lang}.`);
				if (normalizeLanguage(alternate.lang) !== "x-default" && target.lang && normalizeLanguage(alternate.lang) !== normalizeLanguage(target.lang)) addIssue(page.issues, "warning", "hreflang_lang_mismatch", `Hreflang ${alternate.lang} wskazuje stronę z lang=${target.lang}.`);
			}
		}
		if (page.hreflang.length > 0 && !page.hreflang.some((alternate) => page.lang && normalizeLanguage(alternate.lang) === normalizeLanguage(page.lang))) addIssue(page.issues, "warning", "hreflang_missing_self", "Brak hreflang wskazującego na własną wersję językową.");
		if (page.hreflang.length > 0 && !page.hreflang.some((alternate) => normalizeLanguage(alternate.lang) === "x-default")) addIssue(page.issues, "warning", "hreflang_missing_default", "Strona ma hreflang, ale nie ma x-default.");
	}
	for (const pageUrl of sitemapSet) {
		const page = reports.find((candidate) => candidate.url === pageUrl);
		if (!page) addIssue(sitemapIssues, "error", "sitemap_page_missing", `Adres z sitemap nie został przeskanowany: ${pageUrl}.`);
		else if (page.indexable && (!page.canonical || localizeUrl(page.canonical, new URL(page.url)) !== page.url)) addIssue(page.issues, "error", "sitemap_canonical_mismatch", `Adres w sitemap ma canonical ${page.canonical ?? "brak"}.`);
	}

	const allIssues = [...reports.flatMap((page) => page.issues), ...sitemapIssues, ...robotsIssues];
	const report: CrawlReport = {
		run: { startedAt, baseUrl: baseUrl.href, pagesDiscovered: visited.size + queue.size, pagesCrawled: reports.length, durationMs: Date.now() - started },
		summary: { errors: allIssues.filter((issue) => issue.level === "error").length, warnings: allIssues.filter((issue) => issue.level === "warning").length, info: allIssues.filter((issue) => issue.level === "info").length, passed: !allIssues.some((issue) => issue.level === "error") },
		global: { robots: { status: robotsIssues.some((issue) => issue.level === "error") ? "fail" : "pass", issues: robotsIssues }, sitemap: { status: sitemapIssues.some((issue) => issue.level === "error") ? "fail" : "pass", issues: sitemapIssues } },
		pages: reports,
		duplicates: { titles: duplicateValues(reports.map((page) => page.title)), descriptions: duplicateValues(reports.map((page) => page.description)), h1: duplicateValues(reports.map((page) => page.h1[0] ?? null)) },
		orphanPages: reports.filter((page) => page.issues.some((issue) => issue.code === "orphan_page")).map((page) => page.url),
	};
	await mkdir(reportsDir, { recursive: true });
	await writeFile(join(reportsDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
	await writeFile(join(reportsDir, "latest.md"), markdownReport(report), "utf8");
	await writeFile(join(reportsDir, "latest.csv"), csvReport(report, sitemapSet), "utf8");
	console.log(`SEO crawl: ${report.summary.passed ? "PASS" : "FAIL"}, ${report.run.pagesCrawled} stron, ${report.summary.errors} błędów, ${report.summary.warnings} ostrzeżeń.`);
	if (!report.summary.passed) process.exitCode = 1;
}

function normalizeLanguage(value: string) {
	return value.trim().toLowerCase().replace(/_/g, "-");
}

async function collectSitemap(url: URL, visited: Set<string>, pages: Set<string>, issues: Issue[]): Promise<boolean> {
	if (visited.has(url.href)) return true;
	visited.add(url.href);
	const result = await fetchText(url);
	if (!result.response) {
		addIssue(issues, "error", "sitemap_fetch_failed", `Nie udało się pobrać sitemap: ${url.href}.`);
		return false;
	}
	if (!result.response.ok) {
		addIssue(issues, "error", "sitemap_http_status", `Sitemap zwróciła status HTTP ${result.response.status}: ${url.href}.`);
		return false;
	}
	if (!result.body.includes("<loc")) {
		addIssue(issues, "error", "sitemap_invalid_xml", `Sitemap nie zawiera elementów loc: ${url.href}.`);
		return false;
	}
	const sitemap = parseSitemapDocument(result.body);
	const locations = sitemapUrls(result.body, url);
	if (sitemap.root === "sitemapindex") {
		if (locations.length === 0) addIssue(issues, "error", "sitemap_empty_index", `Indeks sitemap nie zawiera podrzędnych sitemap: ${url.href}.`);
		let success = true;
		for (const child of locations) success = (await collectSitemap(new URL(child), visited, pages, issues)) && success;
		return success;
	} else {
		if (sitemap.root !== "urlset") {
			addIssue(issues, "error", "sitemap_invalid_root", `Sitemap ma nieprawidłowy element główny: ${url.href}.`);
			return false;
		}
		for (const page of locations) pages.add(page);
	}
	return true;
}

function markdownReport(report: CrawlReport) {
	const rows = report.pages.flatMap((page) => page.issues.filter((issue) => issue.level === "error").map((issue) => `| Error | ${new URL(page.url).pathname} | ${issue.message} |`));
	const issueCounts = [...new Set(report.pages.flatMap((page) => page.issues.map((issue) => issue.code)))].map((code) => ({ code, count: report.pages.flatMap((page) => page.issues).filter((issue) => issue.code === code).length })).sort((a, b) => b.count - a.count);
	const warningRows = issueCounts.filter((item) => report.pages.some((page) => page.issues.some((issue) => issue.code === item.code && issue.level === "warning"))).map((item) => `| ${item.code} | ${item.count} |`).join("\n");
	const acceptedRows = [...ACCEPTED_WARNING_CODES].map((code) => {
		const count = report.pages.flatMap((page) => page.issues).filter((issue) => issue.code === code && issue.level === "info").length;
		return `| ${code} | ${count} |`;
	}).join("\n");
	return `# SEO Crawl QA\n\n- Wynik: ${report.summary.passed ? "PASS" : "FAIL"}\n- Przeskanowano: ${report.run.pagesCrawled} podstron\n- Błędy: ${report.summary.errors}\n- Ostrzeżenia: ${report.summary.warnings}\n- Informacje: ${report.summary.info}\n\n## Kontrole globalne\n\n- robots.txt: ${report.global.robots.status}\n- sitemap: ${report.global.sitemap.status}\n\n## Błędy blokujące\n\n| Poziom | URL | Problem |\n|---|---|---|\n${rows.length ? rows.join("\n") : "| OK | | Nie znaleziono błędów blokujących. |"}\n\n## Ostrzeżenia według kodu\n\n| Kod | Liczba |\n|---|---:|\n${warningRows || "| OK | 0 |"}\n\n## Świadomie pominięte (accepted risk, decyzja 2026-09-19)\n\n| Kod | Liczba |\n|---|---:|\n${acceptedRows}\n\n## Duplikaty\n\n- Title: ${report.duplicates.titles.length}\n- Description: ${report.duplicates.descriptions.length}\n- H1: ${report.duplicates.h1.length}\n\n## Strony osierocone\n\n${report.orphanPages.length ? report.orphanPages.map((url) => `- ${new URL(url).pathname}`).join("\n") : "Nie znaleziono stron osieroconych."}\n`;
}

function csvCell(value: string | number | boolean | null | undefined) {
	const textValue = value === null || value === undefined ? "" : String(value);
	return `"${textValue.replace(/"/g, '""')}"`;
}

function csvReport(report: CrawlReport, sitemapSet: Set<string>) {
	const header = ["url", "status", "finalUrl", "contentType", "responseTimeMs", "indexable", "inSitemap", "orphan", "title", "titleLength", "description", "descriptionLength", "h1Count", "headingSequence", "canonical", "lang", "hreflang", "schemaTypes", "imageCount", "issueLevels", "issueCodes", "issueDetails", "foundFrom"];
	const rows = report.pages.map((page) => [
		page.url,
		page.status,
		page.finalUrl,
		page.contentType,
		page.responseTimeMs,
		page.indexable,
		sitemapSet.has(page.url),
		report.orphanPages.includes(page.url),
		page.title,
		page.title?.length ?? "",
		page.description,
		page.description?.length ?? "",
		page.h1Count,
		page.headings.map((level) => `H${level}`).join(" > "),
		page.canonical,
		page.lang,
		page.hreflang.map((item) => `${item.lang}:${item.url}`).join(" | "),
		page.jsonLdTypes.join(" | "),
		page.images,
		unique(page.issues.map((issue) => issue.level)).join(" | "),
		unique(page.issues.map((issue) => issue.code)).join(" | "),
		page.issues.map((issue) => `${issue.code}: ${issue.message}`).join(" | "),
		page.foundFrom.join(" | "),
	]);
	return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main().catch((error) => { console.error(error); process.exitCode = 1; });
