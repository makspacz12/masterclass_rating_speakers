-- ============================================================================
--  Masterclass Leadership — schemat bazy (Supabase / Postgres)
--  Model: szablon pytań (biblioteka) + przypisania do ankiet/prelegentów.
--
--  JAK URUCHOMIĆ:
--   1) Supabase → Authentication → Sign In / Providers → włącz "Anonymous sign-ins".
--   2) Supabase → SQL Editor → wklej całość → Run.
--   3) (Opcjonalnie) uruchom supabase/seed.sql, by mieć dane przykładowe.
--
--  DLACZEGO auth.uid():
--   Ocena jest anonimowa, ale przez logowanie anonimowe (signInAnonymously) każdy
--   widz dostaje realny auth.uid(). RLS poniżej pozwala czytać wszystkim treść
--   ankiet/pytań, a pisać — tylko własny profil i własne odpowiedzi.
-- ============================================================================

-- RESET — usuwa istniejące tabele wraz z danymi, żeby skrypt był w pełni
-- powtarzalny (rozwiązuje błąd „relation already exists"). Przy świeżej
-- konfiguracji bezpieczne. NIE uruchamiaj, gdy masz już prawdziwe odpowiedzi!
drop table if exists odpowiedzi, ankieta_pytania, uzytkownicy, pytania, ankiety, prelegenci cascade;

-- 1. PRELEGENCI
create table if not exists prelegenci (
  id          bigserial primary key,
  imie        text not null,
  nazwisko    text not null,
  bio         text,
  zdjecie_url text,
  kolejnosc   int  not null,
  created_at  timestamptz default now()
);

-- 2. ANKIETY (dwa typy uczestników)
create table ankiety (
  id         bigserial primary key,
  nazwa      text not null,
  typ_grupy  text not null unique
);

-- 3. PYTANIA (biblioteka — każde pytanie istnieje raz)
create table pytania (
  id     bigserial primary key,
  tresc  text not null,
  typ    text not null check (typ in ('otwarte','ocena','binarne','single','multiple')),
  opcje  jsonb
);

-- 4. ANKIETA_PYTANIA (przypisania: które pytanie, w której ankiecie, dla
--    którego prelegenta, na której pozycji)
create table ankieta_pytania (
  id            bigserial primary key,
  ankieta_id    bigint not null references ankiety(id)    on delete cascade,
  prelegent_id  bigint not null references prelegenci(id) on delete cascade,
  pytanie_id    bigint not null references pytania(id)     on delete cascade,
  kolejnosc     int    not null,
  unique (ankieta_id, prelegent_id, kolejnosc)
);

-- 5. UZYTKOWNICY (profil = anonimowy user auth + jego typ grupy)
--    id = auth.uid() (default), powiązany z auth.users — spójny z RLS.
create table uzytkownicy (
  id         uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  typ_grupy  text not null references ankiety(typ_grupy),
  utworzony  timestamptz default now()
);

-- 6. ODPOWIEDZI (jedna odpowiedź = user + konkretne przypisanie pytania)
--    user_id domyślnie = auth.uid(), więc klient nie musi go podawać.
create table odpowiedzi (
  user_id              uuid   not null default auth.uid() references uzytkownicy(id) on delete cascade,
  ankieta_pytania_id   bigint not null references ankieta_pytania(id) on delete cascade,
  odpowiedz            jsonb  not null,
  created_at           timestamptz default now(),
  primary key (user_id, ankieta_pytania_id)
);

-- DANE STARTOWE: dwie ankiety
insert into ankiety (nazwa, typ_grupy) values
  ('Doświadczeni liderzy', 'doswiadczeni'),
  ('Młodzi liderzy',       'mlodzi');

-- ============================================================================
--  RLS — reguły dostępu
-- ============================================================================
alter table prelegenci      enable row level security;
alter table ankiety         enable row level security;
alter table pytania         enable row level security;
alter table ankieta_pytania enable row level security;
alter table uzytkownicy     enable row level security;
alter table odpowiedzi      enable row level security;

-- Treść ankiet/pytań jest publicznie czytelna (edycję robi się z panelu / service_role)
create policy "publiczny_odczyt" on prelegenci      for select using (true);
create policy "publiczny_odczyt" on ankiety         for select using (true);
create policy "publiczny_odczyt" on pytania         for select using (true);
create policy "publiczny_odczyt" on ankieta_pytania for select using (true);

-- Użytkownik widzi/zmienia tylko swój profil
create policy "wlasny_profil" on uzytkownicy
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Użytkownik zapisuje/czyta tylko swoje odpowiedzi.
-- UWAGA: zbiorcze wyniki 300 osób czyta się z panelu / service_role / przez widok
-- agregujący — klucz anon celowo nie ma dostępu do cudzych odpowiedzi.
create policy "wlasne_odpowiedzi" on odpowiedzi
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
