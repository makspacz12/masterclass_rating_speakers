import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QUESTIONS } from '@/data/evaluation'

/**
 * Treści pytań pobierane z Supabase (tabela `pytania`, sortowane po `id`).
 *
 * Zwraca tablicę 6 tekstów. Do czasu odpowiedzi z bazy (lub przy błędzie /
 * pustym wyniku) zwraca QUESTIONS — te same teksty, więc UI nie miga pustką
 * ani się nie przeskakuje. Źródłem prawdy jest baza; plik to tylko fallback.
 */
export function useQuestions(): string[] {
  const [questions, setQuestions] = useState<string[]>([...QUESTIONS])

  useEffect(() => {
    let cancelled = false
    supabase
      .from('pytania')
      .select('tresc')
      .order('id')
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return
        setQuestions(data.map((row) => row.tresc as string))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return questions
}
