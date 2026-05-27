'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Speaker } from '@/data/speakers'

interface SpeakerCardProps {
  speaker: Speaker
  /**
   * Gdy podane — przycisk „bio" jest interaktywny i rozwija biografię.
   * Gdy pominięte (np. karta na scenie przejścia) — przycisk jest statyczny.
   */
  bio?: { open: boolean; onToggle: () => void }
}

/**
 * Kompaktowa karta prelegenta: zdjęcie + imię + tytuł wystąpienia + (opcjonalnie)
 * rozwijane bio. Reużywana jako nagłówek widoku oceny ORAZ jako karta na scenie
 * przejścia między prelegentami — dzięki czemu handoff jest bezszwowy.
 */
export function SpeakerCard({ speaker, bio }: SpeakerCardProps) {
  const open = bio?.open ?? false
  return (
    <div className="overflow-hidden rounded-3xl border border-[#EBE3D5] bg-white shadow-[0_8px_30px_-12px_rgba(28,27,31,0.18)]">
      <div className="relative bg-[#1C1B1F]">
        <img
          src={speaker.photo}
          alt={speaker.name}
          draggable={false}
          className="h-72 w-full object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
      </div>

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5642A]">
          Prelegent
        </p>
        <h1 className="mt-1.5 font-display text-[26px] font-extrabold leading-tight text-[#1C1B1F]">
          {speaker.name}
        </h1>

        <div className="mt-3 rounded-xl bg-[#FBF6EE] p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A07A4A]">
            Tytuł wystąpienia
          </p>
          <p className="mt-1 font-serif text-[18px] italic leading-snug text-[#9A5A24]">
            {speaker.talkTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={bio?.onToggle}
          disabled={!bio}
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#EBE3D5] bg-white px-4 py-3 text-left transition-colors hover:border-[#DD7A3B]/40 disabled:cursor-default"
        >
          <span className="text-[14px] font-semibold text-[#1C1B1F]">
            {open ? 'Ukryj bio prelegenta' : 'Pokaż bio prelegenta'}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#9A9283] transition-transform duration-300 ${
              open ? 'rotate-180 text-[#C5642A]' : ''
            }`}
          />
        </button>

        {bio && (
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-3 px-1 pt-4">
                  {speaker.bio.split('\n').map((para, i) => (
                    <p
                      key={i}
                      className="text-[14px] leading-relaxed text-[#56514A]"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
