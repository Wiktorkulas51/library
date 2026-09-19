Plik tylko read only

Audyt commitów i procesu
Przyjmuję, że „Kiszczak” oznacza Tymoteusza Juszczaka, ponieważ w rejestrze projektów nie ma klienta Kiszczak, a najbliższe dopasowanie to [Tymoteusz Juszczak](D:/Programy/client-projects/clients/tymoteusz-juszczak/strona).
Audyt obejmował:
historię commitów wszystkich lokalnych branchy i referencji,
strukturę zmian w kodzie,
testy i checki jakości,
powtarzające się problemy mobilne, z kartami, nawigacją i routingiem,
kontekst projektów,
retrospektywę Aleksandry,
możliwości obecnego starter kita.
Nie zmieniałem żadnych plików.
Podsumowanie liczbowe
Projekt	Commitów	Okres	Dominujące zmiany	Testy
Aleksandra Klisik	364	5 do 14 lipca	184 design, 117 fix	Brak
Przemysław Stałanowski	189	14 do 15 lipca	84 fix, 77 design	47/47
Tymoteusz Juszczak	469	9 do 13 lipca	200 fix, 163 design	79/83

Najważniejszy wniosek: projekty były prowadzone głównie jako szybkie pętle wizualne:
zmiana,
podgląd,
kolejna korekta,
cofnięcie,
kolejna korekta,
dopiero później częściowe testy.
To działa przy bardzo szybkiej pracy, ale powoduje duży koszt, dryf kodu i powtarzanie tych samych problemów.
1. Projekt Aleksandry Klisik
Ścieżka:
[aleksandra-klisik/site](D:/Programy/client-projects/clients/aleksandra-klisik/site)
Charakter projektu
To nie jest projekt starter kitowy. Jest to statyczny landing page oparty bezpośrednio o:
index.html,
assets/css/style.css,
assets/js/main.js.
Nie ma package.json, Vitest, automatycznych testów ani formalnych checków.
Historia pracy
Projekt miał 364 commity w ciągu 10 dni.
Najważniejsze statystyki:
style.css był modyfikowany w 322 commitach,
index.html w 137 commitach,
main.js w 36 commitach,
184 commity miały charakter wizualny,
117 commitów było naprawczych,
było wiele commitów typu revert.
To pokazuje, że główny proces wyglądał tak:
szybkie poszukiwanie kierunku wizualnego,
dużo ręcznych korekt CSS,
dopasowanie layoutu do breakpointów,
poprawianie hero, countdownu, navbaru i kart,
cofanie nietrafionych zmian,
późniejsze dopisywanie SEO, footeru i accessibility.
Nie był to stabilny proces implementacyjny. Był to intensywny proces eksperymentalnego dopracowywania wyglądu.
Główne obszary zmian
Najwięcej pracy pochłonęły:
hero,
navbar i menu mobilne,
countdown,
karty kierunków,
CTA,
footer,
clip-path i pseudo-elementy,
responsive breakpoints,
hover i animacje,
CDN ikon,
preload fontów,
SEO i schema.org.
W commitach widać liczne próby dotyczące:
wysokości hero,
pozycjonowania postaci i budynku,
przycisków,
strzałek,
kolorów,
obramowań,
clip-path,
countdownu,
zachowania menu na mobile,
zachowania kart w breakpointach 1024, 1280 i 1440 px.
Problemy procesu
Retrospektywa Aleksandry potwierdza problemy, które wynikają również z historii Git:
brak check-listy desktopowej,
brak testów linków,
brak testów rzeczywistych urządzeń,
brak testu zachowania countdownu po terminie,
brak walidacji HTML i CSS,
subiektywne QA typu „wygląda dobrze”,
rozproszone poprawki mailowe,
brak formalnych kamieni milowych,
niedoszacowany zakres.
Szczególnie istotny jest fakt, że część linków prowadziła do 404 i została znaleziona przez klientkę. To oznacza, że wizualny sukces nie oznaczał gotowości produkcyjnej.
Konkretne przykłady
Commit SEO 2c70529 dodał jednocześnie:
metadata,
Open Graph,
Twitter cards,
canonical,
robots,
structured data,
preload fontów,
lazy loading,
footer,
poprawki Lenis,
nowe linki.
Była to zmiana obejmująca wiele niezależnych tematów w jednym commicie. Utrudnia to:
znalezienie przyczyny regresji,
cofnięcie tylko jednej części,
sprawdzenie, co dokładnie zostało zweryfikowane,
rozdzielenie problemu SEO od problemu wizualnego.
W projekcie występowały również liczne commity revert, dotyczące między innymi:
clip-path,
hero,
CTA,
countdownu,
kolorów,
ikon,
z-index,
navbaru.
To nie oznacza złej pracy. Pokazuje natomiast, że brakowało bezpiecznego miejsca na eksperymenty wizualne i wcześniejszej walidacji na ustalonej macierzy ekranów.
Co poszło dobrze
Kierunek wizualny został zaakceptowany bardzo szybko.
Projekt miał wyraźną identyfikację.
Portfolio pomogło sprzedażowo.
Finalny landing był rozwijany z dużą dbałością o detale.
Pojawiły się poprawki accessibility, takie jak focus-visible i aria-controls.
Dodano wymiary obrazów, co ograniczało CLS.
Zidentyfikowano problem CDN ikon i naprawiono go przez zmianę źródła.
Główna diagnoza
Projekt Aleksandry nie potrzebował przede wszystkim większej liczby commitów. Potrzebował systemu kontroli:
viewport matrix,
link checker,
test expiry countdownu,
walidacja HTML,
visual QA,
jedna lista feedbacku,
ograniczenie liczby równoległych eksperymentów.
2. Projekt Przemysława Stałanowskiego
Ścieżka:
[przemyslaw-stalanowski](D:/Programy/client-projects/clients/przemyslaw-stalanowski)
Charakter projektu
To projekt oparty na starter kicie Astro, Tailwind i TypeScript.
Najwięcej zmian dotyczyło:
HeroWireframeBlock.astro,
PortfolioMasonryBlock.astro,
ContactWireframeBlock.astro,
CalculatorWireframeBlock.astro,
AboutWireframeBlock.astro,
SaunaWireframeBlock.astro,
FooterColumnsBlock.astro,
Layout.astro.
Historia pracy
Projekt ma 189 commitów w ciągu dwóch dni.
To bardzo duże zagęszczenie zmian. W praktyce oznaczało:
szybkie tworzenie sekcji,
intensywną korektę layoutu,
poprawki mobile,
korekty treści,
poprawki animacji,
poprawki linków i anchorów,
zmiany Lenis,
poprawki portfolio,
zmiany strony sauny.
Wystąpiły także commity revert, między innymi dotyczące układu ikon i hero.
Najważniejsze problemy techniczne
1. Brak stabilnej warstwy nawigacji
W historii widać ciąg zmian dotyczących:
Lenis,
CSS smooth scroll,
anchorów,
resetowania pozycji,
CTA prowadzących do kontaktu,
przywracania wcześniejszego zachowania.
Przykładowo commit 5b167e8 usunął własną obsługę anchorów z Layout.astro i przywrócił CSS smooth scroll.
To jest sygnał, że starter kit nie ma jednego, stabilnego kontraktu dla:
scrollowania do sekcji,
przejścia między stronami,
anchorów,
Astro ClientRouter,
Lenis,
resetu pozycji po nawigacji.
Każdy projekt rozwiązuje ten problem ponownie.
2. Problemy mobile w testimonialach
Commit 89b8405 przywracał:
animację marquee na mobile,
maskę krawędziową,
pauzę po aktywacji dotykiem,
ograniczenie hover tylko do urządzeń z kursorem.
To była dobra poprawka techniczna. Dobrze, że dodano test komponentu. Problem polega na tym, że takie zachowanie powinno być domyślnie rozwiązane w komponencie starter kita, a nie odkrywane w każdym projekcie.
3. Testy pojawiły się za późno
Testy są obecne, ale nie od początku dla całego zakresu. Widać, że dopisywano je dopiero po wystąpieniu problemów:
testimonials,
FAQ sauny,
wybrane sekcje.
Brakuje testów kontraktowych dla:
kart portfolio,
przycisków,
hero,
mobile drawer,
anchorów,
długich tekstów,
linków kontaktowych,
routingu,
placeholderów konfiguracyjnych.
4. Aktualne checki jakości nie przechodzą
Obecny wynik:
testy: 47/47, przechodzą,
check:atomic: nie przechodzi,
10 naruszeń,
check:imports: nie przechodzi,
1 relatywny import w src/config/site.ts.
Naruszenia Atomic Design obejmują między innymi:
przycisk powrotu do góry,
FilterCard,
MobileDrawer,
stopkę,
PortfolioCarousel,
import z registry do registry.
To oznacza, że projekt może przejść testy funkcjonalne, ale nadal nie spełnia ustalonych reguł architektury.
5. Niebezpieczna martwa konfiguracja
W [src/config/site.ts](D:/Programy/client-projects/clients/przemyslaw-stalanowski/src/config/site.ts) nadal znajdują się:
kontakt@example.com,
+48 123 456 789,
ul. Przykładowa 123,
przykładowe social media,
Nazwa strony,
Krótki opis.
Obecnie komponenty nie używają aktywnie tego obiektu, ale to nadal poważne ryzyko. Agent albo kolejny developer może zacząć importować tę konfigurację i wprowadzić fałszywe dane do:
stopki,
schema.org,
meta tagów,
formularza,
danych kontaktowych,
CMS.
Starter kit powinien blokować produkcyjny build, jeśli pozostają wartości przykładowe.
Co poszło dobrze
Projekt korzysta ze wspólnego systemu komponentów.
Testy jednostkowe faktycznie istnieją i przechodzą.
Zostały dodane testy związane z mobile.
Usuwano niepotwierdzone informacje z oferty sauny.
Pojawiły się poprawki jakościowe dotyczące:łamania długich tekstów,
layoutu stopki,
responsywności,
scroll snap,
dotyku,
autoplay,
SEO.

Została dodana dokumentacja deployu.
Główna diagnoza
Projekt Przemysława był najbliżej prawidłowego procesu starter kitowego, ale nadal brakowało trzech bramek:
check jakości przed dalszą pracą,
visual QA na konkretnych viewportach,
walidacja danych przed implementacją sekcji.
W efekcie część pracy została wykonana na bazie danych, które później trzeba było usuwać lub prostować.
3. Projekt Tymoteusza Juszczaka
Ścieżka:
[Tymoteusz Juszczak](D:/Programy/client-projects/clients/tymoteusz-juszczak/strona)
Charakter projektu
To najbardziej rozbudowany projekt:
Astro,
Tailwind,
TypeScript,
trzy języki,
wiele stron prawnych,
blog,
CMS,
SEO,
formularze,
routingi lokalizowane,
wersje specjalizacji,
wielokrotne zmiany danych klienta.
Historia pracy
Projekt ma 469 commitów w ciągu pięciu dni.
Najczęściej zmieniane pliki:
CtaContactFormBlock.astro, 71 commitów,
NavbarLawBlock.astro, 52,
SpecializationsGridBlock.astro, 33,
Layout.astro, 33,
HeroLawBlock.astro, 33,
AboutLawBlock.astro, 31,
FooterMinimalBlock.astro, 31,
src/data/tymoteusz-client-revisions.test.ts, 16.
To bardzo dużo zmian w tych samych komponentach. Wskazuje to na silne sprzężenie pomiędzy:
feedbackiem klienta,
treścią,
designem,
routingiem,
lokalizacją,
zachowaniem mobile.
Największe obszary pracy
1. Mobile
Powtarzały się poprawki dotyczące:
overflow w kontakcie,
mapy,
siatek,
łamania emaila przy 320 px,
centrowania stopki,
hero,
draweru,
trust section,
CTA,
floating buttons,
układu kart.
Przykładowe commity:
1d81d7f, poprawa overflow w kontakcie,
9b3ba3d, kolejna poprawa overflow,
ab7f3c4, łamanie emaila i centrowanie danych faktury,
c362cda, centrowanie stopki na mobile.
To jest dokładnie ten typ problemów, który powinien być wykrywany przez starter kitową stronę testową z długimi danymi.
2. Anchory, Lenis i Astro navigation
Powstała seria zmian:
44458a6,
46e7943,
25d1926,
1a93c58,
b3347d5,
350f153,
33c59c2.
Dotyczyły one:
hash scroll,
astro:after-swap,
resetowania scrolla,
race condition,
Lenis,
CTA prowadzących do sekcji,
przejścia na inne podstrony.
W commitcie 46e7943 użyto setInterval co 50 ms, aby oczekiwać na gotowość Lenis. Późniejsze commity dalej poprawiały reset przed i po nawigacji.
To jest bardzo mocny dowód, że potrzebna jest wspólna biblioteka nawigacji, a nie osobne implementacje w każdym projekcie.
3. Testy regresyjne są wartościowe, ale kruche
Plik:
[src/data/tymoteusz-client-revisions.test.ts](D:/Programy/client-projects/clients/tymoteusz-juszczak/strona/src/data/tymoteusz-client-revisions.test.ts)
Testuje wiele ważnych rzeczy:
treści niemieckie,
dane kontaktowe,
legal pages,
routing,
WhatsApp,
mapy,
footer,
języki,
SEO,
privacy,
terms,
dane CMS.
To jest dobry kierunek. Problem polega na tym, że część testów sprawdza dokładny tekst źródłowy komponentów, zamiast zachowanie lub dane wynikowe.
Obecnie wynik to:
16 plików testowych,
83 testy,
79 przechodzi,
4 nie przechodzą.
Błędy dotyczą:
niemieckiego tekstu SEO,
warunku generowania h1,
mapowania niemieckich tras,
sprawdzenia komponentu WhatsApp w layoutcie.
To oznacza, że testy wykryły rozjazd pomiędzy oczekiwaniami a aktualnym kodem, ale nie zostały utrzymane po kolejnych zmianach.
4. Brak pełnej zgodności pomiędzy testami a kodem
Przykład:
test oczekuje konkretnego zapisu Astro.url.pathname.startsWith(...),
aktualny komponent używa innego warunku,
test oczekuje konkretnego fragmentu <WhatsAppContact />,
aktualny layout ma inny zapis importu lub komponentu.
To niekoniecznie oznacza błąd działania. Oznacza jednak, że testy są mocno związane z implementacją. Przy zmianie sposobu zapisu od razu stają się czerwone.
Lepszy model:
testować dane wejściowe,
testować wygenerowany HTML,
testować listę tras,
testować obecność dokładnego linku,
testować jedną strukturę h1,
testować zachowanie w przeglądarce.
5. Drugi problem z martwą konfiguracją
W [src/config/site.ts](D:/Programy/client-projects/clients/tymoteusz-juszczak/strona/src/config/site.ts) również pozostają:
kontakt@example.com,
przykładowy telefon,
przykładowy adres,
Nazwa strony,
domyślne kolory starter kita.
Obiekt nie jest obecnie używany przez kod, ale nie powinien istnieć w projekcie klienta po jego uruchomieniu.
6. Duża migracja SEO
Commit f939b87 zmienił 36 plików i wprowadził dużą migrację SEO dla 96 stron.
To jest przykład zmiany, która powinna mieć osobny proces:
raport źródłowy,
walidacja danych,
migracja,
test routingu,
test canonical,
test hreflang,
kontrola duplikatów.
W tym projekcie część takich zabezpieczeń została dodana, ale dopiero w trakcie pracy.
Co poszło dobrze
Najlepszy poziom testów spośród trzech projektów.
Dobre wykorzystanie testów regresyjnych klienta.
Wiele realnych problemów zostało wykrytych i zapisanych w historii.
Poprawki mobilne były konkretne, na przykład min-w-0, łamanie emaili i centrowanie.
Pojawiły się testy dotyczące legal pages i lokalizacji.
Projekt ma większą dbałość o dokumentację i automatyzację niż pozostałe dwa.
Architektura komponentowa została utrzymana, a check:atomic dla Tymoteusza przechodzi.
Główna diagnoza
To najbardziej dojrzały projekt technicznie, ale jednocześnie najbardziej obciążony zakresem.
Problemem nie był brak pracy. Problemem było łączenie w jednym procesie:
zmian treści,
zmian designu,
zmian routingu,
migracji SEO,
CMS,
legal pages,
poprawek mobile,
zmian animacji.
Przy takim zakresie starter kit musi wymuszać separację etapów.
4. Problemy powtarzające się we wszystkich projektach
A. Mobile nie jest osobnym etapem QA
We wszystkich projektach pojawiają się korekty po fakcie:
overflow,
szerokie karty,
długie emaile,
hero wychodzący poza viewport,
problemy z menu,
nieprawidłowe marginesy,
zbyt szerokie CTA,
problemy z dotykiem,
błędne zachowanie hover.
To nie powinno być wykrywane dopiero po ręcznej obserwacji.
Starter kit powinien mieć gotowy test fixture z:
długim nagłówkiem,
długim słowem,
długim adresem email,
długim telefonem,
kilkoma kartami,
mapą,
formularzem,
przyciskiem z długim tekstem,
obrazem bez proporcji,
poziomym sliderem,
menu mobilnym,
sekcją z anchorem.
B. Karty są głównym źródłem regresji
Karty pojawiały się w:
portfolio,
specjalizacjach,
testimonials,
footerze,
ofertach,
sekcjach usług.
Powtarzające się problemy:
brak min-w-0,
treść nie łamie się poprawnie,
card grid nie przełącza się dobrze,
ikona wymusza za dużą szerokość,
CTA wypycha kartę,
hover działa tylko na desktopie,
animacja przesłania zawartość,
poziomy scroll jest trudny w dotyku.
Starter kit powinien mieć jeden kontrakt dla kart:
min-w-0,
max-w-full,
bez wymuszania szerokości przez dzieci,
bez hover-only interaction,
minimalny touch target,
wariant dla stack mobile,
wariant dla horizontal scroll,
test długich treści,
test overflow.
C. Lenis i scroll są implementowane per projekt
W Tymoteuszu i Przemysławie pojawiły się podobne problemy:
anchor scroll,
reset pozycji,
scroll po Astro swap,
race condition,
Lenis gotowy za późno,
różne offsety,
mieszanie CSS smooth scroll z JS smooth scroll.
To powinno zostać wyciągnięte do jednego modułu starter kita, na przykład:
navigation-scroll.client.ts,
jedna funkcja scrollToAnchor,
jedna funkcja resetScrollAfterNavigation,
jeden offset nagłówka,
obsługa astro:after-swap,
obsługa prefers-reduced-motion,
test na link lokalny,
test na link do innej strony,
test na link z hash.
D. Dane przykładowe są nadal obecne
W dwóch projektach pozostają przykładowe dane kontaktowe.
To jest bardzo niebezpieczne, ponieważ agent może uznać siteConfig za źródło prawdy.
Starter kit powinien mieć walidator, który blokuje build, jeśli wykryje:
example.com,
Nazwa strony,
Krótki opis,
+48 123 456 789,
ul. Przykładowa,
social media z #,
@ jako placeholder,
niepotwierdzone dane,
puste dane kontaktowe.
E. Brak jednej bramki końcowej
Obecnie można mieć:
przechodzące testy, ale niedziałający Atomic Design,
działający layout, ale błędne linki,
poprawny build, ale złe dane,
dobry desktop, ale zepsute mobile,
poprawny kod, ale niepoprawny live deployment.
Potrzebny jest jeden command gate.
Proponowana komenda:
{
  "qa:client": "npm run test:client && npm run check:atomic && npm run check:imports && npm run check:mobile && npm run check:links && npm run check:content && npm run build"
}
5. Co usprawnić w starter kicie
Priorytet P0, konieczne
1. Wbudowany mobile QA
W starter kicie powinny istnieć:
npm run check:mobile
npm run test:mobile
check:mobile powinien sprawdzać statycznie:
podejrzane w-screen,
elementy z dużą szerokością,
brak min-w-0 w gridach,
potencjalny horizontal overflow,
zbyt małe touch targety,
hover-only interaction,
obrazy bez width i height,
brak alt,
przypadki whitespace-nowrap,
przyciski wypychające kontener.
test:mobile powinien uruchamiać testy zachowania i korzystać z visual QA.
Dla Codex:
używać wbudowanej przeglądarki Codex,
zmieniać viewport,
oglądać stronę po każdej większej zmianie wizualnej,
sprawdzać layout, overflow, menu, karty, CTA i anchory.
Dla OpenCode:
agent musi wiedzieć, że należy użyć Chrome DevTools,
ma sprawdzić viewport, console, computed styles, DOM, overflow i screenshot,
nie powinien udawać wizualnej weryfikacji na podstawie samego kodu.
2. Gotowa strona QA
Starter kit powinien zawierać wewnętrzną stronę, na przykład:
/qa/mobile-fixture/
Powinna zawierać:
hero,
navbar,
drawer,
cards,
grid,
slider,
testimonials,
formularz,
mapa,
długie dane,
CTA,
footer,
cookie banner,
anchor sections,
różne języki.
Dzięki temu agent może wykryć regresję komponentu bez czekania na pełny projekt klienta.
3. Walidator danych klienta
Dodać:
npm run check:content
Walidator powinien odrzucać wartości przykładowe i niepotwierdzone.
Powinien też sprawdzać:
wymagane pola firmy,
telefon,
email,
adres,
social media,
logo,
domenę,
dane do schema.org,
dane do stopki,
zgodność danych globalnych z danymi sekcji.
4. Walidator linków
Dodać:
npm run check:links
Powinien sprawdzać:
lokalne routy,
linki do anchorów,
linki językowe,
linki w stopce,
linki CTA,
linki zewnętrzne,
brak href="#",
brak 404,
brak nieistniejących stron lokalizowanych.
To rozwiązałoby problem, który Aleksandra odkryła dopiero po stronie klientki.
5. Jeden system scrollowania
Starter kit powinien mieć gotowy moduł obsługi:
anchorów,
scroll reset,
Astro navigation,
Lenis,
offsetu nagłówka,
reduced motion.
Nie powinno się dopisywać setInterval i lokalnych listenerów w każdym projekcie.
Priorytet P1, bardzo ważne
1. Testy kontraktowe komponentów
Dla każdego podstawowego komponentu:
Button,
Card,
Navbar,
MobileDrawer,
Hero,
Section,
Grid,
Footer,
Contact,
Testimonials,
powinien istnieć test kontraktu.
Przykłady:
Button nie wychodzi poza kontener przy długim tekście.
Card nie powoduje overflow.
Drawer można zamknąć klawiaturą.
Navbar ma poprawny stan po przejściu na inną stronę.
Anchor działa po Astro swap.
Hero nie przekracza viewportu przy 320 px.
Karta nie wymaga hover do pokazania informacji.
Animacja nie ukrywa treści, gdy JavaScript nie wystartuje.
2. Oddzielenie testów danych od testów implementacji
Zamiast:
expect(source).toContain('Astro.url.pathname.startsWith(...)')
lepiej testować:
jakie strony otrzymują h1,
jakie linki zostały wygenerowane,
jakie trasy istnieją,
jaki HTML powstaje po renderze,
czy konkretny link ma właściwy href.
Testy nie powinny być przywiązane do konkretnego zapisu kodu, jeśli rezultat pozostaje taki sam.
3. Page registry validator
Dodać walidator, który sprawdza:
czy każdy sectionId istnieje,
czy każdy dataKey istnieje,
czy nie ma zduplikowanych identyfikatorów,
czy strona ma dokładnie jedno h1,
czy wersje językowe mają komplet sekcji,
czy route map jest spójny,
czy linki lokalizowane wskazują prawidłowe strony.
4. Kontrola obrazów
Każdy obraz powinien mieć:
alt,
width,
height,
loading,
określone proporcje,
zoptymalizowany format,
kontrolę fallbacku.
To zapobiegnie problemom z CLS i layoutem kart.
5. Reduced motion
Wszystkie animacje powinny mieć wspólną obsługę:
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms;
    transition-duration: 0.01ms;
    scroll-behavior: auto;
  }
}
Należy również sprawdzać, czy treść pozostaje widoczna, gdy animacja nie wystartuje.
6. Usunięcie martwej konfiguracji
src/config/site.ts powinien być albo:
jedynym źródłem danych,
albo usunięty.
Nie powinno być sytuacji, w której istnieje konfiguracja z przykładowymi danymi, ale projekt korzysta z innych plików.
Priorytet P2, usprawnienia procesu
1. Checklista w repozytorium
Każdy projekt powinien mieć plik:
.docs/client-qa.md
Z sekcjami:
dane klienta,
routing,
mobile,
desktop,
accessibility,
SEO,
linki,
formularze,
deployment,
finalna akceptacja.
2. Rozdzielenie commitów
Zamiast łączyć wszystko w jeden commit:
feat: seo + performance + footer + lenis + links
lepiej:
feat: add SEO metadata
feat: add footer content
fix: guard Lenis initialization
fix: update FAQ link
perf: preload hero fonts
Dzięki temu łatwiej:
testować,
cofać,
analizować,
znaleźć źródło regresji.
3. Stały rytm pracy
Proponowany proces:
Zablokowanie danych klienta.
Zablokowanie route map.
Zbudowanie layoutu bazowego.
Zbudowanie komponentów.
Dodanie treści.
Mobile QA.
Desktop QA.
Accessibility i linki.
SEO.
Build i deployment.
Finalna weryfikacja live.
4. Feedback klienta w jednym miejscu
Każdy projekt powinien mieć:
.docs/client-feedback.md
Każdy punkt:
numer,
źródło,
opis,
screenshot,
status,
commit,
data weryfikacji.
To ograniczy problemy, które pojawiły się u Aleksandry przez wiele rozproszonych maili.
6. Proponowany proces dla następnego klienta
Etap 1, discovery
Przed kodem:
finalne dane klienta,
wszystkie linki,
logo,
kolory,
fonty,
treści,
wymagane strony,
języki,
zakres poprawek,
deadline,
liczba rund feedbacku.
Bez tego agent nie powinien budować finalnych sekcji.
Etap 2, foundation
Najpierw:
design tokens,
globalne tło,
typography,
Button,
Card,
Container,
Section,
Grid,
Navbar,
MobileDrawer,
scroll system.
Po tym uruchomić:
npm run test
npm run check:atomic
npm run check:imports
npm run check:mobile
Etap 3, komponenty i dane
Dopiero potem:
hero,
about,
portfolio,
testimonials,
CTA,
contact,
footer,
strony dodatkowe.
Każdy komponent powinien mieć test na:
mobile,
długie dane,
brak obrazka,
długi tekst,
focus,
touch,
reduced motion.
Etap 4, visual QA
Po każdej większej zmianie:
Mobile
320 px,
375 px,
390 px,
414 px.
Tablet
768 px,
834 px,
1024 px.
Desktop
1280 x 720,
1366 x 768,
1440 x 900,
1920 x 1080.
Dla każdego viewportu sprawdzić:
brak poziomego scrolla,
hero,
navbar,
drawer,
karty,
CTA,
footer,
obrazy,
anchory,
formularze.
Etap 5, final gate
Przed przekazaniem:
npm run test
npm run check:atomic
npm run check:imports
npm run check:mobile
npm run check:links
npm run check:content
npm run build
Dodatkowo:
screenshoty kluczowych viewportów,
sprawdzenie console,
sprawdzenie rzeczywistych linków,
sprawdzenie wersji live,
sprawdzenie mobile w Codex Browser albo Chrome DevTools, zależnie od środowiska.
7. Najważniejsze decyzje dla starter kita
Moja kolejność wdrożenia:
check:content, blokada placeholderów.
check:links, blokada 404 i href="#".
check:mobile, overflow, karty i touch targets.
Wspólny system Lenis i anchorów.
Strona /qa/mobile-fixture/.
Testy kontraktowe Button, Card, Navbar, Drawer i Hero.
qa:client, jedna końcowa bramka.
Page registry validator.
Checklista feedbacku i handover.
Dopiero później bardziej zaawansowane automatyczne visual diffy.
Końcowy werdykt
Największym problemem nie był brak umiejętności implementacyjnych. Problemem było to, że projekty nie miały wspólnej bramki jakości po zmianach wizualnych.
Aleksandra pokazała koszt braku testów i manualnego QA.
Przemysław pokazał, że same testy jednostkowe nie wystarczą, jeśli checki architektury nie przechodzą.
Tymoteusz pokazał, że nawet rozbudowany zestaw testów może dryfować, jeśli testuje implementację zamiast zachowania.
Starter kit powinien więc przejąć z projektów powtarzające się rozwiązania, a przede wszystkim wymuszać:
widzenie strony przez agenta,
sprawdzanie mobile po zmianach,
testowanie kart na ekstremalnych danych,
walidację linków,
walidację danych klienta,
stabilny scroll,
końcowy raport QA.
Aktualny stan repozytoriów został pozostawiony bez zmian. W Przemysławie istnieje dodatkowo nieśledzony plik przemyslaw-stalanowski-useme.zip, którego nie dotykałem.
