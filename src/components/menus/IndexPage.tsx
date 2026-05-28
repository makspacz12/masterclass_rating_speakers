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
 * Menu dla CZUBKOWSKIEJ — estetyka magazynu śledczego:
 * side-panel z prawej, kremowy papier + magenta, duże Playfair, duotone mini-zdjęcia.
 */
export function IndexPage({
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
          key="index-page"
          className="fixed inset-0 z-[85]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#1A1A1A]/55 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="absolute right-0 top-0 flex h-full w-[88%] max-w-[400px] flex-col overflow-hidden border-l-4 border-[#A8336B] bg-[#FAF4EA] shadow-[-30px_0_60px_-10px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
              <h3 className="font-playfair text-[20px] font-bold italic text-[#1A1A1A]">
                ❦ Spis wydań
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Zamknij"
                className="flex h-9 w-9 items-center justify-center border-2 border-[#1A1A1A] bg-[#FAF4EA] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto">
              {speakers.map((s, i) => {
                const active = s.id === currentId
                return (
                  <li key={s.id} className="border-b border-[#1A1A1A]/15">
                    <button
                      type="button"
                      onClick={() => !active && onJumpTo(s.id)}
                      disabled={active}
                      className={cn(
                        'flex w-full items-center gap-4 px-5 py-4 text-left transition-colors',
                        active
                          ? 'cursor-default bg-[#A8336B] text-white'
                          : 'bg-transparent hover:bg-[#A8336B]/8',
                      )}
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#1A1A1A]">
                        <img
                          src={s.photo}
                          alt={s.name}
                          style={{ objectPosition: s.focus ?? '50% 22%' }}
                          className="h-full w-full object-cover"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(168,51,107,0.35), rgba(26,26,26,0.18))',
                            mixBlendMode: 'multiply',
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'font-playfair text-[18px] font-bold italic leading-none',
                            active ? 'text-white' : 'text-[#A8336B]',
                          )}
                        >
                          № {String(i + 1).padStart(2, '0')}
                        </p>
                        <p
                          className={cn(
                            'mt-1 truncate font-grotesk text-[12px] font-bold uppercase tracking-[0.16em]',
                            active ? 'text-white/85' : 'text-[#1A1A1A]',
                          )}
                        >
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
