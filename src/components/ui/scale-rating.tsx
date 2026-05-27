'use client'

import { useState } from 'react'
import type { ElementType } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScaleRatingProps {
  value: number | null
  /** Przekazuje wybraną wartość lub `null`, gdy użytkownik odkliknie wybór. */
  onChange: (value: number | null) => void
  lowLabel?: string
  highLabel?: string
  max?: number
  /**
   * Wariant animacji wyboru:
   *  • 'lift'  (domyślny) — płynne uniesienie skrajnej wartości (CSS),
   *  • 'pop'   — sprężyste „odbicie" wciśniętej wartości (framer-motion),
   *  • 'inset' — wartość „wciska się" w głąb (cień wewnętrzny, bez unoszenia).
   */
  pressVariant?: 'lift' | 'pop' | 'inset'
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
  pressVariant = 'lift',
}: ScaleRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const items = Array.from({ length: max }, (_, i) => i + 1)
  const reference = hover ?? value ?? 0
  const endpoint = hover ?? value
  const isPop = pressVariant === 'pop'
  const isInset = pressVariant === 'inset'
  const useMotion = isPop || isInset
  const Btn = (useMotion ? motion.button : 'button') as ElementType

  return (
    <div>
      <div
        className="flex items-stretch gap-[6px]"
        onMouseLeave={() => setHover(null)}
      >
        {items.map((n) => {
          const filled = n <= reference
          const isEndpoint = n === endpoint
          const motionProps = isPop
            ? {
                whileTap: { scale: 0.84 },
                animate: { scale: isEndpoint ? 1.16 : 1 },
                transition: { type: 'spring', stiffness: 480, damping: 16 },
              }
            : isInset
              ? {
                  whileTap: { scale: 0.9 },
                  animate: { scale: 1 },
                  transition: { type: 'spring', stiffness: 600, damping: 30 },
                }
              : {}
          return (
            <Btn
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onClick={() => onChange(n === value ? null : n)}
              {...motionProps}
              className={cn(
                'flex h-11 flex-1 items-center justify-center rounded-xl border text-[15px] font-semibold tabular-nums',
                useMotion ? 'transition-colors duration-200' : 'transition-all duration-200 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--acc)_40%,transparent)]',
                filled
                  ? 'border-transparent bg-[var(--acc)] text-white'
                  : 'border-[#E7DECF] bg-white text-[#6B6457] hover:border-[color-mix(in_srgb,var(--acc)_40%,transparent)]',
                // 'lift' — uniesienie + cień zewnętrzny
                isEndpoint &&
                  !useMotion &&
                  'z-10 scale-[1.1] shadow-[0_8px_20px_-6px_color-mix(in_srgb,var(--acc)_65%,transparent)]',
                // 'pop' — odbicie (skala przez framer) + mocniejszy cień
                isEndpoint &&
                  isPop &&
                  'z-10 shadow-[0_10px_26px_-6px_color-mix(in_srgb,var(--acc)_75%,transparent)]',
                // 'inset' — wciśnięcie w głąb (cień wewnętrzny)
                isEndpoint &&
                  isInset &&
                  'z-10 shadow-[inset_0_3px_7px_rgba(0,0,0,0.4)]',
              )}
            >
              {n}
            </Btn>
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
