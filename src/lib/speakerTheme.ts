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
  // Bralczyk — głęboka leśna zieleń (klasyczny, „literacki" charakter)
  'jerzy-bralczyk': {
    '--acc': '#3E6B52',
    '--acc-strong': '#2C4F3C',
    '--acc-soft': '#E5EFE8',
    '--acc-soft2': '#EFF4F0',
    '--acc-title': '#284A37',
    '--acc-label': '#5A7A66',
  },
}

/** Zwraca nadpisania zmiennych CSS akcentu dla danego prelegenta (lub {} = domyślny). */
export function speakerThemeVars(speakerId: string): CSSProperties {
  return (THEMES[speakerId] ?? {}) as CSSProperties
}
