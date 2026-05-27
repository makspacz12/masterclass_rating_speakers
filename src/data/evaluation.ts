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
