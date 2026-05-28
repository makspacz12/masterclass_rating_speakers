'use client'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import { cn } from '@/lib/utils'

interface MenuProps {
  open: boolean
  onClose: () => void
  speakers: Speaker[]
  currentId: string
  onJumpTo: (id: string) => void
}

/**
 * Menu dla KRÓLEWSKIEGO — estetyka premium dark-gold:
 * full-bleed dark sheet, duże portret-karty 4:5 ze złotym akcentem,
 * shimmer na aktualnej.
 */
export function GoldDeck({
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
          key="gold-deck"
          className="fixed inset-0 z-[85] flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="absolute bottom-0 flex max-h-[92dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl border-t border-[#C9A14A]/40 bg-[#070A12] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-[#C9A14A]/15 blur-[80px]" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-[#9FB8C8]/10 blur-[80px]" />

            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="font-display text-[11px] font-bold uppercase tracking-[0.34em] text-[#E6C77E]">
                Galeria · {String(speakers.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Zamknij"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A14A]/40 bg-white/[0.03] text-[#E6C77E] hover:border-[#C9A14A]/80 hover:bg-[#C9A14A]/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="grid grid-cols-2 gap-3 overflow-y-auto p-4">
              {speakers.map((s, i) => {
                const active = s.id === currentId
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => !active && onJumpTo(s.id)}
                      disabled={active}
                      className={cn(
                        'group relative block w-full overflow-hidden rounded-xl border transition-all',
                        active
                          ? 'cursor-default border-[#C9A14A] shadow-[0_0_30px_-8px_rgba(201,161,74,0.7)]'
                          : 'border-white/10 hover:border-[#C9A14A]/60',
                      )}
                    >
                      <div className="relative aspect-[3/4] w-full">
                        <img
                          src={s.photo}
                          alt={s.name}
                          style={{ objectPosition: s.focus ?? '50% 28%' }}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        {active && (
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#C9A14A]/35 via-transparent to-transparent" />
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <p className="font-display text-[9px] font-semibold uppercase tracking-[0.32em] text-[#E6C77E]">
                            № {String(i + 1).padStart(2, '0')}
                          </p>
                          <p className="mt-1 truncate font-display text-[14px] font-bold leading-tight tracking-[-0.01em] text-white">
                            {s.name}
                          </p>
                        </div>
                      </div>
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
