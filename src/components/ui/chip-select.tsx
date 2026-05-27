'use client'

import { cn } from '@/lib/utils'

interface ChipSelectProps {
  options: readonly string[]
  value: string | null
  /** Przekazuje wybraną wartość lub `null`, gdy użytkownik odkliknie aktywny chip. */
  onChange: (value: string | null) => void
}

/**
 * Wybór jednej opcji z listy w formie „chipów" (zawijane do nowej linii).
 * Bez nakładek/overlayów — nic nie zasłania kolejnych pytań.
 */
export function ChipSelect({ options, value, onChange }: ChipSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(active ? null : opt)}
            className={cn(
              'rounded-full border px-4 py-2.5 text-[14px] font-medium transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--acc)_40%,transparent)]',
              active
                ? 'border-transparent bg-[var(--acc)] text-white shadow-[0_5px_16px_-6px_color-mix(in_srgb,var(--acc)_60%,transparent)]'
                : 'border-[#E7DECF] bg-white text-[#6B6457] hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--acc)_40%,transparent)] hover:text-[var(--acc-strong)]',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
