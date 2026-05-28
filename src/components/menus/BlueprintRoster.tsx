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
 * Menu dla MONCARZA — estetyka „blueprint / inżynierska":
 * kanciaste karty z corner-brackets, monospace, teal accent, siatka w tle.
 * Bottom-sheet, stagger animation.
 */
export function BlueprintRoster({
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
          key="blueprint-roster"
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
            className="absolute inset-0 cursor-default bg-[#16202B]/55 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="absolute bottom-0 flex max-h-[88dvh] w-full max-w-[440px] flex-col overflow-hidden border-t-2 border-[#0F766E] bg-[#ECEFF3] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(15,118,110,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.07) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          >
            <div className="flex items-center justify-between border-b border-[#16202B]/15 px-5 py-3">
              <span className="font-spacemono text-[10px] font-bold uppercase tracking-[0.32em] text-[#0F766E]">
                // Roster 05
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Zamknij"
                className="flex h-9 w-9 items-center justify-center border-2 border-[#16202B] bg-[#ECEFF3] text-[#16202B] hover:bg-[#16202B] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <ul className="space-y-2.5">
                {speakers.map((s, i) => {
                  const active = s.id === currentId
                  return (
                    <li key={s.id}>
                      <motion.button
                        type="button"
                        onClick={() => !active && onJumpTo(s.id)}
                        disabled={active}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                        className={cn(
                          'group relative flex w-full items-center gap-3 border-2 bg-white p-2 text-left transition-colors',
                          active
                            ? 'cursor-default border-[#0F766E]'
                            : 'border-[#16202B]/20 hover:border-[#0F766E]',
                        )}
                      >
                        {/* corner brackets */}
                        <span className="pointer-events-none absolute -left-[3px] -top-[3px] h-2.5 w-2.5 border-l-2 border-t-2 border-[#0F766E]" />
                        <span className="pointer-events-none absolute -right-[3px] -top-[3px] h-2.5 w-2.5 border-r-2 border-t-2 border-[#0F766E]" />
                        <span className="pointer-events-none absolute -bottom-[3px] -left-[3px] h-2.5 w-2.5 border-b-2 border-l-2 border-[#0F766E]" />
                        <span className="pointer-events-none absolute -bottom-[3px] -right-[3px] h-2.5 w-2.5 border-b-2 border-r-2 border-[#0F766E]" />
                        <img
                          src={s.photo}
                          alt={s.name}
                          style={{ objectPosition: s.focus ?? '50% 30%' }}
                          className="h-14 w-12 object-cover grayscale-[0.2] contrast-[1.04]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-spacemono text-[9.5px] font-bold uppercase tracking-[0.24em] text-[#0F766E]">
                            Profil {String(i + 1).padStart(2, '0')}
                          </p>
                          <p className="mt-0.5 truncate font-grotesk text-[15px] font-bold uppercase leading-tight tracking-[-0.01em] text-[#16202B]">
                            {s.name}
                          </p>
                        </div>
                        {active && (
                          <span className="shrink-0 font-spacemono text-[9px] font-bold uppercase tracking-[0.24em] text-[#0F766E]">
                            ● Active
                          </span>
                        )}
                      </motion.button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
