-- ============================================================================
--  DANE z aplikacji (prelegenci + pytania z formularza + przypisania).
--  Uruchom RAZ na świeżej bazie PO schema.sql:  SQL Editor → wklej → Run.
--
--  UWAGA: schemat `prelegenci` nie ma kolumny na tytuł wystąpienia — jeśli go
--  potrzebujesz w bazie, trzeba dodać kolumnę (powiedz, dopiszę).
-- ============================================================================

-- 1) PRELEGENCI (5 osób, zgodnie z src/data/speakers.ts)
insert into prelegenci (imie, nazwisko, bio, zdjecie_url, kolejnosc) values
(
  'Piotr', 'Moncarz',
  'Piotr D. Moncarz, Ph.D., P.E., F. ASCE, NAE, inżynier, naukowiec, przedsiębiorca, notoryczny budowniczy mostu Innowacyjna Polska – Innowacyjne Stany Zjednoczone, a w tym przede wszystkim Dolina Krzemowa. Wieloletni Consulting i Adjunct Profesor Uniwersytetu Stanforda, wieloletni członek zespołu naukowo-badawczego firmy / think-tanku Exponent, w której przeszedł przez wszystkie szczeble korporacyjne i naukowe, kończąc z najwyższym tytułem Senior Fellow. Współzałożyciel, wieloletni prezes i CEO, obecnie wiceprzewodniczący firmy wydobycia ciepła geotermalnego XGS Energy.
Wybrany do amerykańskiej National Academy of Engineering. Współzałożyciel i przez ponad 20 lat przewodniczący US-Polish Trade Council. Współtwórca programu Top 500 Innovators. Założyciel, Prezes i CEO Poland in Silicon Valley Center for Science, Innovation, and Entrepreneurship.',
  '/prelegenci/piotr-moncarz.jpg', 1
),
(
  'Sylwia', 'Czubkowska',
  'Dziennikarka i ekspertka nowych technologii. Przez lata związana z czołowymi tytułami gospodarczo-technologicznymi — „Przekrojem", „Dziennikiem Gazetą Prawną" i „Gazetą Wyborczą"; była redaktorką naczelną magazynu Spider''s Web+. Współtworzy popularny podcast „Techstorie" w TOK FM.
Autorka książek „Chińczycy trzymają nas mocno" oraz „Bóg techy. Jak wielkie firmy technologiczne przejmują władzę nad Polską i światem" (2025) — reportażu śledczego o cichej ekspansji globalnych korporacji technologicznych i ich realnym wpływie na suwerenność państw. Wielokrotnie nagradzana i nominowana, m.in. do Grand Press.',
  '/prelegenci/sylwia-czubkowska.jpg', 2
),
(
  'Krzysztof M.', 'Górski',
  'Astrofizyk i kosmolog, Sekretarz Generalny Akademii Kopernikańskiej. Studia astronomiczne ukończył na Uniwersytecie Mikołaja Kopernika w Toruniu, a doktorat z fizyki uzyskał na Uniwersytecie Warszawskim. Prowadził badania m.in. na UC Berkeley, w Los Alamos, w Princeton, w Institute for Advanced Study, na Uniwersytecie w Chicago, w CNRS w Paryżu oraz w Goddard Space Flight Center. Od 2003 roku pracuje w Jet Propulsion Laboratory (NASA).
Twórca metody HEALPix — narzędzia do konstrukcji, wizualizacji i analizy map sygnału astronomicznego na całej sferze niebieskiej, wykorzystywanej w misjach takich jak WMAP, Planck, Fermi LAT i Gaia. Laureat prestiżowej Nagrody Grubera w dziedzinie kosmologii, uhonorowany tytułem „Futurysty Roku 2024".',
  '/prelegenci/krzysztof-gorski.png', 3
),
(
  'Jerzy', 'Bralczyk',
  'Profesor nauk humanistycznych, językoznawca specjalizujący się w języku mediów, reklamy i polityki. Urodzony w 1947 roku w Ciechanowie, absolwent polonistyki Uniwersytetu Warszawskiego, gdzie wykłada w Instytucie Dziennikarstwa. Wieloletni członek Rady Języka Polskiego, w której zasiada również w prezydium jako wiceprzewodniczący.
Jeden z najbardziej rozpoznawalnych popularyzatorów wiedzy o polszczyźnie — współtwórca i gospodarz programów telewizyjnych oraz radiowych, m.in. „Mówi się", „Na słówko" i „Słowo o słowie". Autor wielu książek o języku i kulturze słowa.',
  '/prelegenci/jerzy-bralczyk.jpg', 4
),
(
  'Jarosław', 'Królewski',
  'Przedsiębiorca, programista, socjolog i inwestor. Współzałożyciel i prezes Synerise — spółki tworzącej oparte na sztucznej inteligencji i big data oprogramowanie dla biznesu, jednej z najszybciej rosnących firm technologicznych w Polsce. Naukowiec i wykładowca Akademii Górniczo-Hutniczej w Krakowie.
Prezes i większościowy właściciel Wisły Kraków — w 2019 roku zainicjował akcję ratunkową klubu oraz pionierską w polskim sporcie emisję akcji w formule crowdfundingu. Wybrany Młodym Liderem Globalnym (Young Global Leader) Światowego Forum Ekonomicznego, powołany do Rady ds. Przyszłości przy Prezesie Rady Ministrów.',
  '/prelegenci/jaroslaw-krolewski.jpg', 5
);

-- 2) PYTANIA — biblioteka odpowiadająca formularzowi w aplikacji (6 pytań)
insert into pytania (tresc, typ, opcje) values
('Ocena ogólna prelegenta',                                        'ocena',    '{"min":1,"max":10}'),
('Na ile treść była wartościowa merytorycznie?',                   'ocena',    '{"min":1,"max":10}'),
('Czy zaprosił(a)byś tego prelegenta ponownie?',                   'binarne',  null),
('Dla kogo to wystąpienie było najbardziej wartościowe?',          'single',   '["Startupowcy","Naukowcy","Studenci","Liderzy biznesu","AI / Tech","Inwestorzy","Wszyscy uczestnicy"]'),
('Jakie pytanie zadał(a)byś temu prelegentowi po wystąpieniu?',    'otwarte',  null),
('Twoje uwagi na temat wystąpienia',                               'otwarte',  null);

-- 3) PRZYPISANIA — wszystkie 6 pytań, dla każdego prelegenta, w obu ankietach.
--    kolejnosc = numer pytania (1..6) w ramach pary (ankieta, prelegent).
insert into ankieta_pytania (ankieta_id, prelegent_id, pytanie_id, kolejnosc)
select
  a.id,
  p.id,
  q.id,
  row_number() over (partition by a.id, p.id order by q.id) as kolejnosc
from ankiety adla 
cross join prelegenci p
cross join pytania q;
