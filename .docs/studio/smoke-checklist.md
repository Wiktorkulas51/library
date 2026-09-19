# Developer Component Library Smoke Checklist

## Trasy i routing
- [ ] `/` renderuje BLUSH (bez panelu Studio jako głównego widoku).
- [ ] `/dev/components/` renderuje bibliotekę komponentów developerskich.
- [ ] `/dev/components/library/` renderuje filtrowanie katalogu.

## Warianty sekcji
- [ ] Zmiana `hero` aktualizuje URL (`?hero=...`) i odświeża widok.
- [ ] Zmiana `pricing` działa dla obu template'ów zgodnie z adapterem.
- [ ] Zmiana `cta` działa i nie wybiera niedozwolonych opcji.
- [ ] Opcja `theme` zmienia `data-theme` bez przeładowania strony.

## JSON profiles
- [ ] Brak query paramów ładuje wartości z `src/studio/profiles/blush.json`.
- [ ] Brak query paramów dla `template=default` ładuje `src/studio/profiles/default.json`.
- [ ] Niepoprawna wartość z URL jest ignorowana i fallbackuje do profilu.

## Sidebar i UX
- [ ] Sidebar pokazuje tylko sekcje dozwolone dla aktywnego adaptera.
- [ ] `Reset All` czyści warianty, zachowuje aktywny `template` w URL.
- [ ] Przełączanie zakładek aktualizuje `studio` w query string.
