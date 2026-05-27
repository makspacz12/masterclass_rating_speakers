'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import { SpeakerCard } from '@/components/SpeakerCard'

interface SpeakerSwapStageProps {
  from: Speaker
  to: Speaker
  dir: number // 1 = następny, -1 = poprzedni
  toIndex: number
  total: number
  onComplete: () => void
}

const DURATION = 0.92
// 4 fazy: A) obecna kurczy się do małego prostokąta w głębi,
// B) mały prostokąt obecnej i mały prostokąt następnej zamieniają się miejscami,
// C) następna rośnie do pełnego rozmiaru.
const TIMES = [0, 0.42, 0.72, 1]
const SMALL = 0.4

/**
 * Scena przejścia „talia kart z głębią":
 *  • obecny prelegent (FROM) kurczy się do małej karty na środku i znika w tyle,
 *  • następny (TO) wchodzi małą kartą z boku (zależnie od kierunku), przesuwa się
 *    na środek wciąż mały („zamiana w tyle"), po czym wyrasta na pełny rozmiar.
 * Karta TO jest zawsze na wierzchu (wystaje zza obecnej). Po zakończeniu animacji
 * wołane jest onComplete() — wtedy RatingFlow commituje indeks i chowa scenę.
 */
export function SpeakerSwapStage({
  from,
  to,
  dir,
  toIndex,
  total,
  onComplete,
}: SpeakerSwapStageProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-[#FBF8F3] via-[#F6F0E6] to-[#F1E9DB]"
      style={{ perspective: 1400 }}
    >
      <div className="mx-auto flex h-full w-full max-w-[440px] flex-col">
        {/* statyczna kopia paska nawigacji (żeby karta lądowała 1:1 z realną stroną) */}
        <div className="border-b border-[#EBE3D5]/80 bg-[#FBF8F3]/85 px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E7DECF] bg-white px-3 text-[14px] font-semibold text-[#3A3730]">
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden xs:inline">Poprzedni</span>
            </div>
            <div className="flex flex-col items-center px-3 py-1">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1C1B1F]">
                <Home className="h-3.5 w-3.5 text-[#C5642A]" />
                Strona główna
              </span>
              <span className="mt-0.5 text-[11px] tabular-nums text-[#A99A80]">
                Prelegent {toIndex + 1} / {total}
              </span>
            </div>
            <div className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E7DECF] bg-white px-3 text-[14px] font-semibold text-[#3A3730]">
              <span className="hidden xs:inline">Następny</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* obszar treści */}
        <div className="relative flex-1">
          {/* miękki cień głębi za kartami */}
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] h-64 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(28,27,31,0.16) 0%, transparent 70%)',
              filter: 'blur(18px)',
            }}
          />

          {/* FROM — obecny: pełny → mały prostokąt w głębi → odjeżdża w bok i znika */}
          <motion.div
            className="absolute left-5 right-5 top-5"
            style={{ transformOrigin: 'center', zIndex: 1 }}
            initial={{ scale: 1, x: 0, opacity: 1, filter: 'blur(0px)' }}
            animate={{
              scale: [1, SMALL, SMALL, SMALL],
              x: [0, 0, dir * 116, dir * 116],
              opacity: [1, 1, 1, 0],
              filter: ['blur(0px)', 'blur(1.5px)', 'blur(1.5px)', 'blur(3px)'],
            }}
            transition={{ duration: DURATION, times: TIMES, ease: 'easeInOut' }}
          >
            <SpeakerCard speaker={from} />
          </motion.div>

          {/* TO — następny: mały prostokąt z boku → na środek (zamiana) → rośnie */}
          <motion.div
            className="absolute left-5 right-5 top-5"
            style={{ transformOrigin: 'center', zIndex: 2 }}
            initial={{
              scale: SMALL,
              x: dir * 116,
              opacity: 0.92,
              filter: 'blur(1.5px)',
            }}
            animate={{
              scale: [SMALL, SMALL, SMALL, 1],
              x: [dir * 116, dir * 116, 0, 0],
              opacity: [0.92, 1, 1, 1],
              filter: ['blur(1.5px)', 'blur(1.5px)', 'blur(1px)', 'blur(0px)'],
            }}
            transition={{ duration: DURATION, times: TIMES, ease: 'easeInOut' }}
            onAnimationComplete={onComplete}
          >
            <SpeakerCard speaker={to} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
