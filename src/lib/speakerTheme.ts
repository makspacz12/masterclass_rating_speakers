import type { CSSProperties } from 'react'

/**
 * Akcent kolorystyczny PER PRELEGENT (zmienne CSS nadpisywane inline).
 * Domyślnie (brak wpisu) obowiązuje terakotowy pomarańcz z klasy `.rating-theme`
 * — czyli Moncarz i pozostali zostają bez zmian. Tu trzymamy tylko wyjątki.
 */
const THEMES: Record<string, Record<string, string>> = {
  // Czubkowska — złoto / szampan (z landingu, jasne)
  'sylwia-czubkowska': {
    '--acc': '#C9A14A',
    '--acc-strong': '#9C7A2C',
    '--acc-soft': '#F6ECD2',
    '--acc-soft2': '#FBF4E2',
    '--acc-title': '#8A6A1E',
    '--acc-label': '#9C8345',
  },
  // Górski — stalowy błękit / platyna (z landingu, głęboki, nie cyjan)
  'krzysztof-gorski': {
    '--acc': '#5E7C95',
    '--acc-strong': '#46627A',
    '--acc-soft': '#E7EEF4',
    '--acc-soft2': '#EFF3F7',
    '--acc-title': '#3E5972',
    '--acc-label': '#5E7585',
  },
}

/** Zwraca nadpisania zmiennych CSS akcentu dla danego prelegenta (lub {} = domyślny). */
export function speakerThemeVars(speakerId: string): CSSProperties {
  return (THEMES[speakerId] ?? {}) as CSSProperties
}
