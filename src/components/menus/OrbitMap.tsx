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
 * Menu dla GÓRSKIEGO — estetyka kosmiczna / obserwatorium:
 * ciemny bottom-sheet z gwiazdami, okrągłe mini-zdjęcia (jak planety),
 * fioletowy glow na aktualnym, monospace + grotesk.
 */
export function OrbitMap({
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
          key="orbit-map"
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
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="absolute bottom-0 flex max-h-[88dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl border-t border-[#8E8CFF]/40 bg-[#05060F] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            {/* gwiazdy */}
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 75% 18%, rgba(255,255,255,0.55), transparent), radial-gradient(1.4px 1.4px at 45% 62%, rgba(199,210,255,0.7), transparent), radial-gradient(1px 1px at 88% 70%, rgba(255,255,255,0.5), transparent)',
              }}
            />
            <div className="absolute -left-20 top-1/3 h-48 w-48 rounded-full bg-[#6E6CE0]/20 blur-[80px]" />

            <div className="relative flex items-center justify-between border-b border-[#8E8CFF]/20 px-5 py-3">
              <span className="font-spacemono text-[10px] font-bold uppercase tracking-[0.32em] text-[#8E8CFF]">
                Spis obserwacji
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Zamknij"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8E8CFF]/40 bg-white/[0.04] text-[#B7B5FF] hover:border-[#8E8CFF]/80 hover:bg-[#8E8CFF]/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="relative space-y-3 overflow-y-auto px-5 py-5">
              {speakers.map((s, i) => {
                const active = s.id === currentId
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => !active && onJumpTo(s.id)}
                      disabled={active}
                      className={cn(
                        'group flex w-full items-center gap-4 rounded-xl border px-3 py-3 text-left transition-colors',
                        active
                          ? 'cursor-default border-[#8E8CFF]/50 bg-[#8E8CFF]/10'
                          : 'border-[#8E8CFF]/15 bg-white/[0.02] hover:border-[#8E8CFF]/45 hover:bg-[#8E8CFF]/[0.06]',
                      )}
                    >
                      <div className="relative shrink-0">
                        <span
                          className={cn(
                            'absolute inset-[-4px] rounded-full border',
                            active
                              ? 'border-[#8E8CFF]/70'
                              : 'border-[#8E8CFF]/25',
                          )}
                        />
                        <div
                          className={cn(
                            'h-14 w-14 overflow-hidden rounded-full bg-[#0C1024]',
                            active
                              ? 'shadow-[0_0_22px_-2px_rgba(142,140,255,0.7)]'
                              : '',
                          )}
                          style={{ outline: '1px solid rgba(142,140,255,0.4)' }}
                        >
                          <img
                            src={s.photo}
                            alt={s.name}
                            style={{ objectPosition: s.focus ?? '50% 30%' }}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-spacemono text-[9.5px] font-bold uppercase tracking-[0.3em] text-[#8E8CFF]">
                          Obs {String(i + 1).padStart(2, '0')}
                        </p>
                        <p className="mt-1 truncate font-grotesk text-[15px] font-semibold text-[#E6EAF7]">
                          {s.name}
                        </p>
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
