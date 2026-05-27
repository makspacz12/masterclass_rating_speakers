/** Konfiguracja formularza oceny prelegenta. */

/** Grupy odbiorców — pytanie „Dla kogo wystąpienie było najbardziej wartościowe?". */
export const AUDIENCES = [
  'Startupowcy',
  'Naukowcy',
  'Studenci',
  'Liderzy biznesu',
  'AI / Tech',
  'Inwestorzy',
  'Wszyscy uczestnicy',
] as const

export type Audience = (typeof AUDIENCES)[number]

/**
 * Domyślne treści pytań — FALLBACK, gdy baza (`pytania`) jeszcze się ładuje lub
 * jest niedostępna. Źródłem prawdy są dane z Supabase (patrz `useQuestions`);
 * tu trzymamy te same teksty tylko po to, by UI nigdy nie migało pustką.
 * Kolejność = kolejność pól formularza i wierszy w tabeli (id 1..6).
 */
export const QUESTIONS = [
  'Ocena ogólna prelegenta',
  'Na ile treść była wartościowa merytorycznie?',
  'Czy zaprosił(a)byś tego prelegenta ponownie?',
  'Dla kogo to wystąpienie było najbardziej wartościowe?',
  'Jakie pytanie zadał(a)byś temu prelegentowi po wystąpieniu?',
  'Twoje uwagi na temat wystąpienia',
] as const

/** Stan odpowiedzi dla jednego prelegenta. */
export interface Answers {
  overall: number | null // ocena ogólna 1–10
  substance: number | null // wartość merytoryczna 1–10
  inviteAgain: 'tak' | 'nie' | null // ponownie?
  audience: Audience | null // dla kogo najwartościowsze
  question: string // pytanie do prelegenta
  notes: string // uwagi
}

export const emptyAnswers: Answers = {
  overall: null,
  substance: null,
  inviteAgain: null,
  audience: null,
  question: '',
  notes: '',
}
