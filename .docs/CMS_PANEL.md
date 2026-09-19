# CMS Panel — Struktura (faktyczna)

**Co klient widzi w panelu Sveltia CMS na podstawie ręcznie utrzymywanego `public/admin/config.yml`.**
Dokument opisuje aktualny stan panelu, stan na 2026-08-06. Użyj jako kontekstu
przy pracy nad CMS, onboardzie klienta i debugowaniu pól.

---

## Kolekcje (5)

W panelu klient widzi 5 kolekcji w tej kolejności:

| # | Kolekcja | Opis |
|---|----------|------|
| 1 | **Treści sekcji** | Treść każdej sekcji strony (hero, oferta, portfolio, itd.) |
| 2 | **SEO stron** | Tytuł/opis/indeksowanie każdej podstrony |
| 3 | **Nawigacja** | Menu górne i stopka |
| 4 | **Ustawienia Globalne** | Dane firmy, SEO globalne, komunikaty formularza, kod własny |
| 5 | **Strony Prawne** | Polityka prywatności, regulamin, cookies |

---

## 1. Treści sekcji (pozycje zależą od stron)

Sekcje widoczne tylko jeśli są używane na którejś stronie. Etykieta
"Strona → Sekcja" mówi, gdzie sekcja się renderuje.

**Strona główna:**
- Strona główna → Hero (tytuł, podtytuł, przyciski CTA, elementy zaufania)
- Strona główna → Oferta (tytuł, podtytuł, elementy: ikona/tytuł/opis)
- Strona główna → Portfolio (tytuł, opis, tagline, elementy: tytuł/kategoria/zdjęcie; ukryte: variants, categories, span, height)
- Strona główna → O firmie (tytuł, opis, highlights)
- Strona główna → Proces współpracy (tytuł, opis, kroki: numer/tytuł/opis/ikona)
- Strona główna → Opinie klientów (tytuł, opis, opinie: cytat/autor/rola/awatar; ukryte: marquee)
- Strona główna → FAQ (tytuł, opis, tagline, elementy: pytanie/odpowiedź, przycisk CTA; ukryte: categories)
- Strona główna → Formularz kontaktowy (tytuł, opis, URL mapy, e-mail, adres, pola formularza; ukryte: social, joinTeam, rows, socialLabel)

**Cennik:**
- Cennik → Kalkulator (usługi, dodatki, podsumowanie, waluta, CTA)

> Pola ukryte w panelu (widoczne tylko w danych): `sections` na stronach (kolejność/warianty sekcji ustawia WebScale), aria-labels.

## 2. SEO stron

Każda podstrona ma swój wpis: **Blog, Cennik, Strona główna, Kontakt, O nas, Realizacje, Usługi**.

Pola wspólne (oprócz Blog):
- **SEO** (tytuł, opis, indeksowanie tej strony)
- ukryte: Nagłówek strony, Sekcje strony (warianty)

**Blog** ma dodatkowo (zamiast pojedynczego SEO):
- **Index** (etykieta, tytuł, opis, empty, metaTitle, metaDescription)
- **Archive** (etykieta, nagłówek, opis, empty, metaTitle, metaDescription)
- **ReadMore** (etykieta przycisku "Czytaj wpis")
- **Block** (etykieta, tytuł, opis, etykieta CTA) — nagłówek sekcji bloga

## 3. Nawigacja

- **Menu górne** (Menu główne: etykiety i linki, Przycisk CTA: etykieta/link/hover)
- **Stopka** (Opis / o firmie, ContactTitle, CopyrightText, Attribution: etykieta/link/prefiks/linkLabel, Kolumny: tytuł+linki, Linki prawne; ukryte: newsletter, promo — elementy wariantu "promo")

## 4. Ustawienia Globalne

Kolejność pozycji:

### Dane firmy
- Pełna nazwa firmy
- Branding / logo (Plik logo, Favicona; ukryte: ikona, font, tagline, logoSuffix)
- Adres (jedna całość: ulica, kod, miasto; ukryte: zipCode, city, name, siteUrl, smtp, contactEmail)
- Telefon, E-mail, Godziny pracy, NIP, KRS
- Social media (Facebook, Instagram, YouTube, X — proste pola z linkami; puste = niewidoczne)

### Kod własny (zaawansowane)
- Własny kod w `<head>` (piksele, meta, skrypty)
- Własny kod na końcu strony (widgety, czat)

### Formularz kontaktowy: komunikaty
- Etykieta „Wyślij", Komunikat sukcesu, Komunikat błędu, Nagłówek formularza
- ukryte: Wysyłanie..., Wyślij kolejną, Spróbuj ponownie, komunikaty sieci, hover teksty, notka prywatności, zgoda RODO, defaultFields

### SEO
- Domyślny tytuł, Domyślny opis, Domyślny obraz (OG), Indeksowanie strony
- Analityka (Google Analytics ID, GTM ID, Facebook Pixel ID, Clarity ID)
- ukryte: follow, siteName, siteUrl, contactEmail (deduplikacja z Dane firmy)

## 5. Strony Prawne

- **Polityka cookies**, **Polityka prywatności**, **Regulamin**
- Każda: Data aktualizacji, Tytuł, Opis (SEO), Treść (markdown z podmieńkami `{{COMPANY_*}}`)

---

## Zasady (czego NIE ma w panelu)

- **Kolejność i warianty sekcji** — ukryte (`sections` w page config), ustawia WebScale
- **Copy UI** — breadcrumbs, pagination, lightbox, floating-bar, legal (etykiety interfejsu) całkiem poza panelem
- **Pola techniczne** — SMTP, schema, aria-labels, siteUrl, version, id, order, uuid
- **Podpis "Projekt i wdrożenie WebScale"** (footerAttribution)

## Mapowanie pliki → pozycje panelu

| Plik danych | Pozycja w CMS |
|---|---|
| `src/data/sections/*.json` | Treści sekcji |
| `src/data/pages/*.json` | SEO stron |
| `src/data/navigation/header.json` | Nawigacja → Menu górne |
| `src/data/navigation/footer.json` | Nawigacja → Stopka |
| `src/data/global/company.json` | Ustawienia Globalne → Dane firmy |
| `src/data/global/seo.json` | Ustawienia Globalne → SEO |
| `src/data/global/form-messages.json` | Ustawienia Globalne → Formularz kontaktowy: komunikaty |
| `src/data/global/custom-code.json` | Ustawienia Globalne → Kod własny (zaawansowane) |
| `src/content/legal/*.json` | Strony Prawne |

## Komendy

| Komenda | Opis |
|---|---|
| `npm run cms:check` | Walidacja config.yml, plików danych i registry |
| `npm run cms:list` | Podgląd struktury panelu (kolekcje, pliki, pola, ukryte) |
| `npm run cms:check` | Walidacja spójności JSON ↔ config ↔ registry |
| `npm run cms:dev` | Lokalny CMS (dev server + /admin/, następnie „Work with Local Repository”) |
