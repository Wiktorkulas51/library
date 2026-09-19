# AI Page Builder — Workflow

> Jak AI tworzy strony dla klientów za pomocą PageBuilder + JSON.

## 3-Fazowy Workflow

### Faza 1: Wireframe (AI)

AI na podstawie informacji od klienta:
1. **Dobiera sekcje** z `src/config/section-registry.ts` — pasujące do profilu klienta
2. **Wyznacza warianty** — kierując się hintami w registry i typem treści
3. **Tworzy page config** w `src/data/pages/[slug].json`
4. **Uzupełnia dane** w `src/data/sections/*.json` — tylko treść, nie strukturę
5. **Gotowe** — strona działa pod `/[slug]`, deploy na subdomenę

### Faza 2: Stylizacja (Designer/AI)

- Projektowanie w `design.md` (google-labs/design.md)
- Sync design tokenów przez `npm run design:sync`
- Kolorystyka, typografia, spacing

### Faza 3: Poprawki (Szczegóły)

- Szlifowanie detali wizualnych
- Dekoracje, animacje, efekty
- To zawsze trwa najdłużej

---

## Page Config (`src/data/pages/[slug].json`)

```json
{
  "seo": {
    "title": "Nazwa firmy | Opis",
    "description": "Meta description pod SEO."
  },
  "sections": [
    { "id": "navbar", "variant": "floating" },
    { "id": "hero", "variant": "service" },
    { "id": "features", "variant": "grid" },
    { "id": "footer", "variant": "columns" }
  ]
}
```

Routing: `[...page].astro` → czyta `src/data/pages/_registry.ts` → ładuje odpowiedni JSON → renderuje przez `PageBuilder`.

---

## Section Data (`src/data/sections/*.json`)

Dane dla sekcji które mają `dataKey` w registry. AI uzupełnia tylko treść.

### Sekcje i ich pola danych

| dataKey | JSON fields | Komponent | Uwagi |
|---------|-------------|-----------|-------|
| `hero` | `{title, titleAccent, tagline, description, primaryCTA, secondaryCTA}` | HeroBlock | |
| `features` | `{heading, intro, items: [{icon, title, description}]}` | FeatureGridBlock | icon = nazwa Phosphor |
| `services` | `{heading, description, items: [{icon, title, description}]}` | ServicesGridBlock | icon = nazwa Phosphor |
| `about` | `{title, description, values: [{title, description, icon}]}` | AboutCenteredBlock | icon = nazwa Phosphor |
| `testimonials` | `{heading, items: [{quote, author, role}]}` | TestimonialGridBlock | |
| `faq` | `{title, description, items: [{q, a}]}` | FaqSimpleBlock itd. | |
| `steps` | `{steps: [{title, description}]}` | StepsVerticalBlock | |
| `cta` | `{title, description, primaryCTA: {label, href}, secondaryCTA: {label, href}}` | CtaCenteredBlock | |
| `team` | `{name, role, description}` | TeamGridBlock | |
| `blog` | `{posts: [{slug, title, publishedAt, excerpt, coverSrc, href}]}` | BlogGridBlock | |
| `pricing` | `{title, description, packages: [{name, price, features}]}` | PricingBlock | |
| `case-studies` | `{items: [{slug, title, excerpt, coverSrc, href}]}` | CaseStudiesGridBlock | |

### Uwagi
- Ikony: używaj nazw Phosphor bez prefiksu (`stack`, `shield-check`, `star`, `currency-circle-dollar`)
- Pola z `?` w TypeScript są opcjonalne — JSON może je pominąć
- Jeśli blok nie ma `dataKey` w registry — nie da się mu przekazać danych przez PageBuilder

---

## Reużywalność danych

`src/data/sections/*.json` są globalne — współdzielone między wszystkimi stronami. Jeśli robisz nowego klienta, **nadpisujesz** zawartość tych plików.

Dla zaawansowanych przypadków (osobne treści na różnych stronach):
- Rozróżnij page configiem różne sekcje
- Lub stwórz nowy page entry z innym zestawem sekcji

---

## Jak AI wybiera sekcje

1. Sprawdź `src/config/section-registry.ts` — lista sekcji + warianty
2. Kieruj się `hint` z registry (np. "Korzyści i funkcje", "Mapa i lokalizacje")
3. Dla typowych stron:

| Typ klienta | Rekomendowane sekcje |
|-------------|---------------------|
| **Wizytówka** | navbar, hero, about, services, testimonials, faq, cta, footer |
| **Landing page** | navbar, hero, features, testimonials, pricing, cta, footer |
| **Usługi** | navbar, hero, services, steps, about, cta, contact-form, footer |
| **Portfolio** | navbar, hero, portfolio, testimonials, cta, footer |

4. Gdy nie wiesz → uzyj `defaultVariant` z registry
5. Preferuj warianty z `dataKey` — wtedy mozesz podpiac dane

---

## Przepływ pracy (krok po kroku)

1. Klient podaje info → AI mapuje na sekcje z registry
2. AI tworzy `src/data/pages/[slug].json` z odpowiednią kolejnością sekcji
3. AI nadpisuje `src/data/sections/[dataKey].json` treścią klienta
4. AI uruchamia `npm run dev` i sprawdza `http://localhost:4321/[slug]`
5. Jeśli brak odpowiedniego bloku → AI tworzy nowy Registry Block w `src/components/registry/` i rejestruje go
