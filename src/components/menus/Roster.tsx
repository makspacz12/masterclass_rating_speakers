'use client'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import { cn } from '@/lib/utils'
import { speakerThemeVars } from '@/lib/speakerTheme'

interface MenuProps {
  open: boolean
  onClose: () => void
  speakers: Speaker[]
  currentId: string
  onJumpTo: (id: string) => void
}

/**
 * Menu wspólne dla shared-path (Bralczyk) — klasyczna lista typu „spis treści"
 * w serifach. Używa zmiennych CSS akcentu z aktualnego prelegenta
 * (`.rating-theme`), więc dziedziczy złoto Bralczyka albo pomarańcz domyślny.
 */
export function Roster({
  open,
  onClose,
  speakers,
  currentId,
  onJumpTo,
}: MenuProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="roster"
          className="fixed inset-0 z-[85] flex justify-center"
          style={speakerThemeVars(currentId)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="absolute bottom-0 flex max-h-[88dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl bg-[#FBF8F3] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center justify-between border-b border-[var(--acc)] px-5 py-3">
              <h3 className="font-serif text-[20px] font-medium italic text-[var(--acc-strong)]">
                Lista gości
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Zamknij"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--acc-strong)]/30 bg-white text-[var(--acc-strong)] hover:bg-[var(--acc-soft)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="overflow-y-auto">
              {speakers.map((s, i) => {
                const active = s.id === currentId
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => !active && onJumpTo(s.id)}
                      disabled={active}
                      className={cn(
                        'flex w-full items-center gap-4 border-b border-[#E7DECF] px-5 py-3.5 text-left transition-colors',
                        active
                          ? 'cursor-default bg-[var(--acc-soft)]'
                          : 'hover:bg-[var(--acc-soft)]/60',
                      )}
                    >
                      <img
                        src={s.photo}
                        alt={s.name}
                        style={{ objectPosition: s.focus ?? '50% 30%' }}
                        className="h-16 w-12 shrink-0 rounded-sm object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--acc-label)]">
                          Prelegent {String(i + 1).padStart(2, '0')}
                        </p>
                        <p className="mt-0.5 truncate font-serif text-[20px] font-medium leading-tight text-[#1C1B1F]">
                          {s.name}
                        </p>
                      </div>
                      {active && (
                        <span className="shrink-0 font-serif text-[12px] italic text-[var(--acc-strong)]">
                          ✦ teraz
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
