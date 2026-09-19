# Handover Checklist — Przekazanie projektu klientowi

> Przed oddaniem projektu klientowi przejdz ponizsza liste.
> Tam gdzie to mozliwe, uzyj automatychnych komend zamiast recznego sprawdzania.

---

## 1. Build & Deploy

- [ ] `npm run build` przechodzi bez bledow i warningow
- [ ] `npm run check:atomic` przechodzi (Atomic Design compliance)
- [ ] `npm run check:imports` przechodzi (hierarchia importow)
- [ ] Strona dziala na produkcji (po `npm run push` / FTP deploy)
- [ ] Nie ma bledow 404, 500 na zadnej podstronie
- [ ] SSL certyfikat jest wazny (jesli wlasona domena)

## 2. Responsywnosc i Layout

- [ ] Strona wyglada dobrze na **mobile (375px)**
- [ ] Strona wyglada dobrze na **tablet (768px)**
- [ ] Strona wyglada dobrze na **desktop (1440px+)**
- [ ] Brak poziomych scrolli na wszystkich widokach
- [ ] Brak nachodzacych na siebie elementow
- [ ] Obrazy sa proporcjonalne, nie rozciagniete
- [ ] Menu/nawigacja dziala na mobile (hamburger)

## 3. Brand i Assets

- [ ] **Favicon** — dziala na wszystkich przegladarkach i urzadzeniach:
  - [ ] Podstawowy `favicon.ico` (w katalogu root/public)
  - [ ] `apple-touch-icon` (dziala przy zapisywaniu do iOS)
  - [ ] Ikona w trybie ciemnym (jesli zaimplementowano)
  - [ ] Favicon widoczna w karcie przegladarki
- [ ] Logo w naglowku i stopce — poprawna wersja (kolor/biale)
- [ ] Kolorystyka zgodna z brand guide (design tokens)
- [ ] Fonty ladowane poprawnie (sprawdz w devtools Network)

## 4. SEO

- [ ] **Meta tagi** — kazda podstrona ma unikalny:
  - [ ] `<title>` (60 znakow max)
  - [ ] `<meta name="description">` (160 znakow max)
  - [ ] `<meta name="robots">` (index/follow dla publicznych)
- [ ] **Open Graph** — dzielenie na social media:
  - [ ] `og:title`, `og:description`, `og:image` dzialaja
  - [ ] `og:url` wskazuje poprawny adres
  - [ ] Sprawdz przez opengraph.xyz
- [ ] **Struktura naglowkow** — logiczna hierarchia: jedna `<h1>`, `<h2>`, `<h3>` itd. (bez skokow)
- [ ] **Semantic HTML** — uzycie `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- [ ] **Sitemap** — `sitemap-0.xml` generuje sie i zawiera wszystkie podstrony
- [ ] **Robots.txt** — nie blokuje istotnych stron, blokuje smieci (/studio/)
- [ ] **Canonical URLs** — kazda strona ma `<link rel="canonical">`
- [ ] **Klient nie ma zdublowanych tresci** (np. `/usluga` i `/usluga/`)
- [ ] **Lighthouse Mobile — SEO >= 90**

## 5. Wydajnosc (Core Web Vitals)

- [ ] Lighthouse Mobile — Performance >= 80
- [ ] Lighthouse Mobile — Accessibility >= 90
- [ ] LCP < 2.5s (sprawdz przez PageSpeed Insights)
- [ ] Obrazy maja atrybuty `width` i `height`
- [ ] Obrazy sa zoptymalizowane (webp/avif, responsive)
- [ ] Czcionki nie blokuja renderowania (font-display: swap)

## 6. Funkcjonalnosc

- [ ] Wszystkie linki dzialaja (nawigacja, CTA, stopka)
- [ ] Formularz kontaktowy wysyla i waliduje dane
- [ ] Strona dziala z wylaczonym JavaScript (graceful degradation)
- [ ] **Cookie consent / banner prywatnosci**:
  - [ ] Banner pokazuje sie przy pierwszej wizycie
  - [ ] Mozna zaakceptowac wszystkie
  - [ ] Mozna odrzucic (tylko niezbedne)
  - [ ] Po wyborze banner znika i nie pojawia sie ponownie
  - [ ] Skrypt analityczny (GA/Plausible) startuje dopiero po zgodzie
- [ ] **Podstrony prawne**:
  - [ ] Polityka prywatnosci (klauzula RODO, dane administratora, cel przetwarzania)
  - [ ] Regulamin / Polityka cookies (jesli wymagane)
  - [ ] Stopka zawiera linki do podstron prawnych

## 7. Jakosc kodu

- [ ] Brak `console.log` i `debugger` w kodzie
- [ ] Brak zakomentowanych fragmentow
- [ ] Wszystkie teksty uzywaja Text.astro / Heading.astro (zadnych surowych `<p>` / `<h1>`)
- [ ] Brak hardcoded kolorow (`text-[#...]`, `bg-[...]`)
- [ ] Brak anty-wzorcow (pill badges, fake quotes, pulsing dots)

## 8. CMS i Dane (jesli wlaczone)

- [ ] Sveltia CMS działa po zalogowaniu
- [ ] Mozna edytowac tresc i zapisac
- [ ] Zmiany w CMS sa widoczne na stronie po deployu

## 9. Dokumentacja (dla nas, nie dla klienta)

- [ ] `.docs/CONTEXT.md` zaktualizowane
- [ ] Design tokens w `design/` zgodne ze stanem faktycznym
- [ ] README.md zawiera komendy uruchomieniowe

---

## Automatyczne czeki (npm scripts)

| Komenda | Co sprawdza |
|---------|-------------|
| `npm run build` | Poprawnosc calego projektu |
| `npm run check:atomic` | Atomic Design compliance |
| `npm run check:imports` | Hierarchia importow |
| `npm run design:sync` | Sync design tokens z CSS |

## Tools zewnetrzne

- [PageSpeed Insights](https://pagespeed.web.dev/) — Core Web Vitals
- [OpenGraph Debugger](https://opengraph.xyz/) — Meta tagi
- [Mobile Friendly Test](https://search.google.com/test/mobile-friendly)
- [W3C Validator](https://validator.w3.org/) — HTML

---

> **Zasada**: Nie oddawaj projektu jesli ktorys z checkboxow (poza sekcja 9) nie jest odhaczony.
