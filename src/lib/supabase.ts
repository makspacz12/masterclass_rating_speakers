import { createClient } from '@supabase/supabase-js'

// Konfiguracja z .env.local (prefiks VITE_ — Vite udostępnia tylko takie zmienne
// w kodzie klienta). Klucz to publishable/anon — przeznaczony do użycia po stronie
// przeglądarki; właściwą ochroną danych są reguły RLS w Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] Brak konfiguracji — ustaw VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY w .env.local',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
