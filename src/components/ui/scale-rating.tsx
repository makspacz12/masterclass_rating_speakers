'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ScaleRatingProps {
  value: number | null
  onChange: (value: number) => void
  lowLabel?: string
  highLabel?: string
  max?: number
}

/**
 * Skala oceny 1–10 z wypełnieniem kumulacyjnym: wybór np. 6 podświetla pola 1–6.
 * Najechanie myszką pokazuje podgląd (1…n), wybrany/podglądany skrajny numer „wyskakuje".
 */
export function ScaleRating({
  value,
  onChange,
  lowLabel = '1 — słaba',
  highLabel = '10 — najwyższa',
  max = 10,
}: ScaleRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const items = Array.from({ length: max }, (_, i) => i + 1)
  const reference = hover ?? value ?? 0
  const endpoint = hover ?? value

  return (
    <div>
      <div
        className="flex items-stretch gap-[6px]"
        onMouseLeave={() => setHover(null)}
      >
        {items.map((n) => {
          const filled = n <= reference
          const isEndpoint = n === endpoint
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onClick={() => onChange(n)}
              className={cn(
                'flex h-11 flex-1 items-center justify-center rounded-xl border text-[15px] font-semibold tabular-nums transition-all duration-200 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DD7A3B]/40',
                filled
                  ? 'border-transparent bg-[#DD7A3B] text-white'
                  : 'border-[#E7DECF] bg-white text-[#6B6457] hover:border-[#DD7A3B]/40',
                isEndpoint &&
                  'z-10 scale-[1.1] shadow-[0_8px_20px_-6px_rgba(221,122,59,0.65)]',
              )}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-[#9A9283]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}
