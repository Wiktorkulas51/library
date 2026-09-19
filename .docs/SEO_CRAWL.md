# SEO Crawl

`qa:seo:crawl` uruchamia lokalny crawler SEO na działającym podglądzie strony. Skrypt korzysta z sitemap, robots.txt oraz linków wewnętrznych i sprawdza między innymi:

- statusy HTTP i odpowiedzi niebędące HTML,
- title, meta description, canonical, robots i H1,
- hierarchię nagłówków, hreflang oraz strony osierocone,
- obrazy bez `alt`, duplikaty metadanych i JSON-LD.

## Uruchomienie

```powershell
npm run qa:seo:crawl
npm run qa:seo:crawl -- --base-url http://127.0.0.1:4321/ --max-pages 100
```

Raporty są zapisywane w `audit-reports/seo-crawl/`:

- `latest.json` zawiera dane maszynowe,
- `latest.md` zawiera podsumowanie dla człowieka,
- `latest.csv` zawiera wynik per strona.

Kod zakończenia jest różny od zera, gdy crawler znajdzie błąd blokujący. Ostrzeżenia pozostają widoczne w raporcie, ale nie blokują komendy.
