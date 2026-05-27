'use client'

import { cn } from '@/lib/utils'

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[]
  value: T | null
  onChange: (value: T) => void
}

/**
 * Przełącznik typu Tak / Nie. Zaznaczony segment płynnie wypełnia się akcentem.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-12 rounded-xl border text-[15px] font-semibold transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DD7A3B]/40',
              active
                ? 'border-transparent bg-[#DD7A3B] text-white shadow-[0_6px_18px_-6px_rgba(221,122,59,0.6)]'
                : 'border-[#E7DECF] bg-white text-[#6B6457] hover:-translate-y-[1px] hover:border-[#DD7A3B]/40 hover:text-[#C5642A]',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
