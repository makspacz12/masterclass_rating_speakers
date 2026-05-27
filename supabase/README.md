# Supabase — baza ocen

Model: **biblioteka pytań + przypisania**. Treść pytania zapisana raz (`pytania`),
podpinana do ankiet/prelegentów przez `ankieta_pytania`. Jedna edycja pytania
zmienia je wszędzie, gdzie występuje. Brak duplikacji.

## Uruchomienie (raz)

1. **Authentication → Sign In / Providers → włącz „Anonymous sign-ins".**
   Bez tego anonimowi widzowie nie zapiszą odpowiedzi (RLS opiera się na `auth.uid()`).
2. **SQL Editor → wklej `schema.sql` → Run.**
3. (Opcjonalnie) **SQL Editor → wklej `seed.sql` → Run** — dane przykładowe.

## Tabele

| Tabela | Po co |
|---|---|
| `prelegenci` | lista prelegentów |
| `ankiety` | dwa typy uczestników (`doswiadczeni`, `mlodzi`) |
| `pytania` | biblioteka pytań (każde raz) |
| `ankieta_pytania` | przypisanie: pytanie → ankieta + prelegent + pozycja |
| `uzytkownicy` | profil anonimowego usera (`id` = `auth.uid()`) + jego `typ_grupy` |
| `odpowiedzi` | odpowiedzi (`user_id` + `ankieta_pytania_id` → JSON) |

## Ściągawka dla biznesu (dodawanie pytań)

**Dozwolone `typ`:** `otwarte`, `ocena`, `binarne`, `single`, `multiple`.

**Wzór pola `opcje` (JSON) i `odpowiedz` zależnie od typu:**

| `typ` | `opcje` | przykład `odpowiedz` |
|---|---|---|
| `otwarte` | `null` | `"Świetna energia"` |
| `ocena` | `{"min":1,"max":5}` | `4` |
| `binarne` | `null` | `true` |
| `single` | `["Wizja","Zespół","Strategia"]` | `"Wizja"` |
| `multiple` | `["Case'y","Praktyka","Q&A"]` | `["Praktyka","Q&A"]` |

**Dodanie prelegenta z pytaniami (3 kroki):**
1. dodaj wiersz w `prelegenci` (imię, nazwisko, zdjęcie, kolejność),
2. jeśli pytania nie ma w bibliotece — dodaj je do `pytania` (treść, typ, opcje),
3. w `ankieta_pytania` podepnij: pytanie → ankieta → prelegent → pozycja.
   Pytanie wspólne = dwa wpisy (jeden do `doswiadczeni`, jeden do `mlodzi`).

## Po stronie aplikacji (do zrobienia później)

- klient woła `supabase.auth.signInAnonymously()` przy wejściu,
- profil: `insert into uzytkownicy (typ_grupy)` — `id` ustawia się z `auth.uid()`,
- zapis: `insert into odpowiedzi (ankieta_pytania_id, odpowiedz)` — `user_id` z `auth.uid()`,
- zbiorcze wyniki czyta się z panelu / `service_role` / widoku agregującego
  (RLS celowo nie wystawia cudzych odpowiedzi przez klucz anon).
