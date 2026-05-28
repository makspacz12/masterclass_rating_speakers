import { createClient } from '@supabase/supabase-js'

// Konfiguracja z .env.local (prefiks VITE_ — Vite udostępnia tylko takie zmienne
// w kodzie klienta). Klucz to publishable/anon — przeznaczony do użycia po stronie
// przeglądarki; właściwą ochroną danych są reguły RLS w Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * WAŻNE: gdy env-vary nie są ustawione (np. brak konfiguracji na Vercelu),
 * `createClient(undefined, undefined)` RZUCA błąd przy imporcie — co psuje
 * cały bundle (też landing). Dlatego podstawiamy poprawne formalnie placeholdery
 * tak, by import nie wybuchł; rzeczywiste zapytania i tak zwrócą błąd (do
 * obsłużenia w `useQuestions` itp.). Konsola dostaje jasny komunikat.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] Brak VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — używam placeholderów. Ustaw zmienne w .env.local (lokalnie) lub w panelu Vercel → Project Settings → Environment Variables.',
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'sb_publishable_placeholder',
)
