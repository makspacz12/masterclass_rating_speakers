import type { CSSProperties } from 'react'

/**
 * Akcent kolorystyczny PER PRELEGENT (zmienne CSS nadpisywane inline).
 * Domyślnie (brak wpisu) obowiązuje terakotowy pomarańcz z klasy `.rating-theme`
 * — czyli Moncarz i pozostali zostają bez zmian. Tu trzymamy tylko wyjątki.
 */
const THEMES: Record<string, Record<string, string>> = {
  // Czubkowska — śliwkowy magenta (mocny, editorialny; kompletnie inny od reszty)
  'sylwia-czubkowska': {
    '--acc': '#A8336B',
    '--acc-strong': '#7E2450',
    '--acc-soft': '#F7E3EE',
    '--acc-soft2': '#FBEFF5',
    '--acc-title': '#6E2147',
    '--acc-label': '#9A5B7E',
    '--f-name': '"Playfair Display", Georgia, serif',
    '--f-ui': '"Space Grotesk", sans-serif',
    '--f-body': 'Inter, sans-serif',
  },
  // Górski — stalowy błękit / platyna (z landingu, głęboki, nie cyjan)
  'krzysztof-gorski': {
    '--acc': '#5E7C95',
    '--acc-strong': '#46627A',
    '--acc-soft': '#E7EEF4',
    '--acc-soft2': '#EFF3F7',
    '--acc-title': '#3E5972',
    '--acc-label': '#5E7585',
    '--f-name': '"Space Mono", monospace',
    '--f-ui': '"Space Mono", monospace',
    '--f-body': 'Inter, sans-serif',
  },
  // Bralczyk — złoto / szampan (to samo, które wcześniej miała Czubkowska)
  'jerzy-bralczyk': {
    '--acc': '#C9A14A',
    '--acc-strong': '#9C7A2C',
    '--acc-soft': '#F6ECD2',
    '--acc-soft2': '#FBF4E2',
    '--acc-title': '#8A6A1E',
    '--acc-label': '#9C8345',
    '--f-name': '"DM Serif Display", Georgia, serif',
    '--f-ui': '"Cormorant Garamond", Georgia, serif',
    '--f-body': '"Cormorant Garamond", Georgia, serif',
  },
}

/** Zwraca nadpisania zmiennych CSS akcentu dla danego prelegenta (lub {} = domyślny). */
export function speakerThemeVars(speakerId: string): CSSProperties {
  return (THEMES[speakerId] ?? {}) as CSSProperties
}
