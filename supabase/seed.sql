-- ============================================================================
--  Dane przykładowe (OPCJONALNE) — uruchom RAZ na świeżej bazie po schema.sql,
--  żeby zobaczyć działający model: 1 prelegent, biblioteka pytań i przypisania
--  (w tym jedno pytanie wspólne dla obu ankiet). Supabase → SQL Editor → Run.
--  Używa podzapytań zamiast sztywnych id, więc jest odporne na numerację serial.
-- ============================================================================

-- Przykładowy prelegent
insert into prelegenci (imie, nazwisko, bio, zdjecie_url, kolejnosc)
values ('Piotr', 'Moncarz', 'Inżynier, naukowiec, przedsiębiorca.', '/prelegenci/piotr-moncarz.jpg', 1);

-- Biblioteka pytań (po jednym z każdego typu)
insert into pytania (tresc, typ, opcje) values
  ('Jak oceniasz prezentację?',          'ocena',    '{"min":1,"max":5}'),
  ('Co najbardziej Ci się podobało?',     'otwarte',  null),
  ('Czy poleciłbyś znajomemu?',           'binarne',  null),
  ('Wybierz najmocniejszy temat',         'single',   '["Wizja","Zespół","Strategia"]'),
  ('Które elementy były wartościowe',     'multiple', '["Case''y","Praktyka","Q&A"]');

-- Przypisania. Pytanie „Jak oceniasz prezentację?" idzie do OBU ankiet
-- (ten sam pytanie_id, dwa wpisy) — to istota modelu bez duplikacji treści.
insert into ankieta_pytania (ankieta_id, prelegent_id, pytanie_id, kolejnosc)
select a.id, p.id, q.id, 1
from ankiety a, prelegenci p, pytania q
where a.typ_grupy = 'doswiadczeni'
  and p.nazwisko = 'Moncarz'
  and q.tresc = 'Jak oceniasz prezentację?';

insert into ankieta_pytania (ankieta_id, prelegent_id, pytanie_id, kolejnosc)
select a.id, p.id, q.id, 1
from ankiety a, prelegenci p, pytania q
where a.typ_grupy = 'mlodzi'
  and p.nazwisko = 'Moncarz'
  and q.tresc = 'Jak oceniasz prezentację?';

-- Pytanie otwarte tylko w ankiecie dla doświadczonych, pozycja 2
insert into ankieta_pytania (ankieta_id, prelegent_id, pytanie_id, kolejnosc)
select a.id, p.id, q.id, 2
from ankiety a, prelegenci p, pytania q
where a.typ_grupy = 'doswiadczeni'
  and p.nazwisko = 'Moncarz'
  and q.tresc = 'Co najbardziej Ci się podobało?';
