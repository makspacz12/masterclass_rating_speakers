'use client'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ArrowUpRight, X } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import { cn } from '@/lib/utils'
import { speakerThemeVars } from '@/lib/speakerTheme'

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
 * bio. Reużywana jako nagłówek widoku oceny ORAZ jako karta na scenie przejścia.
 *
 * Wyjątek per-prelegent: Sylwia Czubkowska ma własny layout (etykieta „Prelegentka",
 * inna czcionka tytułu, inny przycisk bio i bio jako wysuwana z dołu „nadkarta").
 */
export function SpeakerCard({ speaker, bio }: SpeakerCardProps) {
  const open = bio?.open ?? false
  const isCzubkowska = speaker.id === 'sylwia-czubkowska'
  const isBralczyk = speaker.id === 'jerzy-bralczyk'
  const isGorski = speaker.id === 'krzysztof-gorski'
  const roleLabel = isCzubkowska ? 'Prelegentka' : 'Prelegent'

  return (
    <div className="overflow-hidden rounded-3xl border border-[#EBE3D5] bg-white shadow-[0_8px_30px_-12px_rgba(28,27,31,0.18)]">
      <div className="relative bg-[#1C1B1F]">
        <img
          src={speaker.photo}
          alt={speaker.name}
          draggable={false}
          style={{ objectPosition: speaker.focus ?? '50% 30%' }}
          className="h-72 w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
      </div>

      <div className="p-5">
        <p className="font-[family-name:var(--f-ui)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--acc-strong)]">
          {roleLabel}
        </p>
        <h1 className="mt-1.5 font-[family-name:var(--f-name)] text-[26px] font-extrabold leading-tight text-[#1C1B1F]">
          {speaker.name}
        </h1>

        <div className="mt-3 rounded-xl bg-[var(--acc-soft2)] p-3.5">
          <p className="font-[family-name:var(--f-ui)] text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--acc-label)]">
            Tytuł wystąpienia
          </p>
          <p
            className={cn(
              'mt-1 leading-snug text-[var(--acc-title)]',
              isCzubkowska
                ? // nowoczesny grotesk, bez kursywy
                  'font-grotesk text-[19px] font-semibold tracking-[-0.015em]'
                : isBralczyk
                  ? // klasyczny serif (Cormorant) — inny niż serifowe imię (DM Serif)
                    'font-serif text-[22px] font-medium not-italic leading-[1.15]'
                  : isGorski
                    ? // techniczny grotesk
                      'font-grotesk text-[19px] font-semibold tracking-[-0.01em]'
                    : 'font-serif text-[18px] italic',
            )}
          >
            {speaker.talkTitle}
          </p>
        </div>

        {/* === Przycisk bio === */}
        {isCzubkowska ? (
          // inny layout: smukła „pigułka" z akcentem i strzałką (nie pogrubiony kafel)
          <button
            type="button"
            onClick={bio?.onToggle}
            disabled={!bio}
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--acc)_45%,transparent)] bg-transparent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--acc-strong)] transition-colors duration-300 hover:bg-[var(--acc-soft)] disabled:cursor-default"
          >
            Poznaj sylwetkę
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        ) : isBralczyk ? (
          // klasyczny serifowy link z podkreśleniem (inny od kafla i pigułki)
          <button
            type="button"
            onClick={bio?.onToggle}
            disabled={!bio}
            className="group mt-4 inline-flex items-center gap-2 font-serif text-[17px] italic text-[var(--acc-strong)] underline decoration-[color-mix(in_srgb,var(--acc)_45%,transparent)] decoration-1 underline-offset-[6px] transition-colors hover:decoration-[var(--acc)] disabled:cursor-default"
          >
            {open ? 'Zwiń biografię' : 'Czytaj biografię'}
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-300',
                open && 'rotate-180',
              )}
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={bio?.onToggle}
            disabled={!bio}
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#EBE3D5] bg-white px-4 py-3 text-left transition-colors hover:border-[color-mix(in_srgb,var(--acc)_40%,transparent)] disabled:cursor-default"
          >
            <span className="text-[14px] font-semibold text-[#1C1B1F]">
              {open ? 'Ukryj bio prelegenta' : 'Pokaż bio prelegenta'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-[#9A9283] transition-transform duration-300',
                open && 'rotate-180 text-[var(--acc-strong)]',
              )}
            />
          </button>
        )}

        {/* === Bio inline (wszyscy poza Czubkowską) === */}
        {bio && !isCzubkowska && (
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
                      className={cn(
                        'font-[family-name:var(--f-body)] leading-relaxed text-[#56514A]',
                        isBralczyk ? 'text-[16.5px]' : 'text-[14px]',
                      )}
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

      {/* === Bio Czubkowskiej — „nadkarta" wysuwana z dołu (jak na komórce) === */}
      {isCzubkowska &&
        bio &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="czubkowska-bio"
                className="fixed inset-0 z-[80] flex justify-center"
                style={speakerThemeVars(speaker.id)}
              >
                {/* tło — kliknięcie zamyka */}
                <motion.button
                  type="button"
                  aria-label="Zamknij"
                  onClick={bio.onToggle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 cursor-default bg-[#1C1B1F]/55 backdrop-blur-sm"
                />

                {/* wysuwana karta */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 32, stiffness: 280 }}
                  className="absolute bottom-0 flex max-h-[88dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-24px_60px_-16px_rgba(0,0,0,0.5)]"
                >
                  {/* zdjęcie + imię na górze */}
                  <div className="relative shrink-0">
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      draggable={false}
                      style={{ objectPosition: speaker.focus ?? '50% 30%' }}
                      className="h-56 w-full object-cover"
                    />
                    <span className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/70" />
                    <button
                      type="button"
                      onClick={bio.onToggle}
                      aria-label="Zamknij bio"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pb-4 pt-12">
                      <p className="font-[family-name:var(--f-ui)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[color-mix(in_srgb,var(--acc)_70%,white)]">
                        Prelegentka
                      </p>
                      <h2 className="mt-0.5 font-[family-name:var(--f-name)] text-[26px] font-extrabold leading-tight text-white">
                        {speaker.name}
                      </h2>
                    </div>
                  </div>

                  {/* bio — przewijane */}
                  <div className="space-y-3 overflow-y-auto px-5 py-5">
                    {speaker.bio.split('\n').map((para, i) => (
                      <p
                        key={i}
                        className="font-[family-name:var(--f-body)] text-[14.5px] leading-relaxed text-[#56514A]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
