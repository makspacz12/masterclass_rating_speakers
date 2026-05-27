'use client'

import { cn } from '@/lib/utils'

interface ChipSelectProps {
  options: readonly string[]
  value: string | null
  onChange: (value: string) => void
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
            onClick={() => onChange(opt)}
            className={cn(
              'rounded-full border px-4 py-2.5 text-[14px] font-medium transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DD7A3B]/40',
              active
                ? 'border-transparent bg-[#DD7A3B] text-white shadow-[0_5px_16px_-6px_rgba(221,122,59,0.6)]'
                : 'border-[#E7DECF] bg-white text-[#6B6457] hover:-translate-y-[1px] hover:border-[#DD7A3B]/40 hover:text-[#C5642A]',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
