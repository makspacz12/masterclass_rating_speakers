'use client'

import { createPortal } from 'react-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, ArrowRight, X } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import type { Answers, Audience } from '@/data/evaluation'
import { AUDIENCES } from '@/data/evaluation'
import { cn } from '@/lib/utils'

/**
 * WIDOK PRELEGENTA #2 — Sylwia Czubkowska (WYJĄTEK, pełna izolacja).
 *
 * Estetyka „editorial magazine" (dziennikarstwo śledcze, Bóg techy, Spider's Web+):
 * kremowy papier, mocny magenta, duży display-serif (Playfair), drop-cap, gruby
 * rule, „pull-quote" z wielkim cudzysłowem przy tytule, byline-meta, duotone-grain
 * na zdjęciach (maskuje pikselizację źródła). Bio OTWIERA się w slide-up sheet
 * z dużym zdjęciem na górze (jak dawniej, ale większe i z efektem print).
 */

interface CzubkowskaRatingProps {
  speaker: Speaker
  answers: Answers
  onChange: <K extends keyof Answers>(field: K, value: Answers[K]) => void
  questions: string[]
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
  onHome: () => void
}

const EASE = [0.22, 1, 0.36, 1] as const
const MAGENTA = '#A8336B'

/** Subtelne ziarno + duotone — maskuje pikselizację małego źródła zdjęcia. */
const PHOTO_FX: React.CSSProperties = {
  filter: 'contrast(1.08) saturate(0.88)',
}

export default function CzubkowskaRating({
  speaker,
  answers,
  onChange,
  questions,
  index,
  total,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onHome,
}: CzubkowskaRatingProps) {
  const [bioOpen, setBioOpen] = useState(false)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#FAF4EA] font-sans text-[#1A1A1A]">
      {/* === Nagłówek — masthead magazynu === */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b-2 border-[#1A1A1A] bg-[#FAF4EA]/95 px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))] backdrop-blur-md">
        <PressNav onClick={onPrev} disabled={isFirst} ariaLabel="Poprzedni">
          <ChevronLeft className="h-5 w-5" />
        </PressNav>
        <button
          type="button"
          onClick={onHome}
          className="flex flex-col items-center px-3 py-1"
        >
          <span className="flex items-center gap-1.5 font-playfair text-[14px] font-bold italic text-[#1A1A1A]">
            <Home className="h-3.5 w-3.5" style={{ color: MAGENTA }} />
            Strona główna
          </span>
          <span className="mt-0.5 font-grotesk text-[9.5px] font-bold uppercase tracking-[0.32em] text-[#1A1A1A]/55">
            № {pad(index + 1)} / {pad(total)}
          </span>
        </button>
        <PressNav onClick={onNext} disabled={isLast} ariaLabel="Następny">
          <ChevronRight className="h-5 w-5" />
        </PressNav>
      </header>

      {/* === COVER: zdjęcie + masthead + nazwisko === */}
      <section className="px-5 pt-5">
        <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/30 pb-1">
          <span className="font-grotesk text-[10px] font-bold uppercase tracking-[0.36em] text-[#A8336B]">
            // Śledztwo
          </span>
          <span className="font-grotesk text-[9px] uppercase tracking-[0.3em] text-[#1A1A1A]/55">
            X edycja
          </span>
        </div>

        {/* zdjęcie — duotone overlay maskuje pikselizację */}
        <motion.figure
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mt-4 overflow-hidden bg-[#1A1A1A]"
        >
          <img
            src={speaker.photo}
            alt={speaker.name}
            draggable={false}
            style={{ ...PHOTO_FX, objectPosition: speaker.focus ?? '50% 22%' }}
            className="aspect-[4/5] w-full object-cover"
          />
          {/* duotone magenta + ink */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(168,51,107,0.35), rgba(26,26,26,0.18))',
              mixBlendMode: 'multiply',
            }}
          />
          {/* grain */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              mixBlendMode: 'overlay',
            }}
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-4 pt-12">
            <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.36em] text-white/85">
              Prelegentka · Dziennikarstwo
            </p>
            <h1 className="mt-1 font-playfair text-[34px] font-bold leading-[0.95] text-white">
              {speaker.name}
            </h1>
          </figcaption>
        </motion.figure>

        {/* pull-quote: tytuł wystąpienia z wielkim magenta cudzysłowem */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-6 pl-9"
        >
          <span
            aria-hidden
            className="absolute -left-2 -top-4 font-playfair text-[80px] leading-none"
            style={{ color: MAGENTA }}
          >
            “
          </span>
          <p className="font-playfair text-[20px] italic leading-[1.25] text-[#1A1A1A]">
            {speaker.talkTitle}
          </p>
        </motion.div>

        {/* byline meta */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#1A1A1A]/15 pt-3 font-grotesk text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A1A1A]/55">
          <span>Spider's Web+</span>
          <span className="text-[#A8336B]">·</span>
          <span>Bóg Techy (2025)</span>
          <span className="text-[#A8336B]">·</span>
          <span>Grand Press</span>
        </div>

        {/* przycisk bio — czarny inverted, editorial */}
        <button
          type="button"
          onClick={() => setBioOpen(true)}
          className="group mt-5 flex w-full items-center justify-between border-2 border-[#1A1A1A] bg-[#1A1A1A] px-5 py-3 text-left text-white transition-colors hover:bg-[#A8336B] hover:border-[#A8336B]"
        >
          <span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.22em]">
            Czytaj sylwetkę
          </span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </section>

      {/* === Sekcja oceny — gruby rule + dingbat === */}
      <div className="mt-10 flex items-center gap-4 px-5">
        <span className="h-[3px] flex-1 bg-[#1A1A1A]" />
        <span className="font-playfair text-[16px] font-bold italic text-[#1A1A1A]">
          ❦ Oceń wystąpienie
        </span>
        <span className="h-[3px] flex-1 bg-[#1A1A1A]" />
      </div>

      {/* === Pytania === */}
      <div className="mt-6 space-y-5 px-5 pb-8">
        <ColumnQ n={1} question={questions[0]}>
          <PressScale value={answers.overall} onChange={(v) => onChange('overall', v)} />
        </ColumnQ>
        <ColumnQ n={2} question={questions[1]}>
          <PressScale value={answers.substance} onChange={(v) => onChange('substance', v)} />
        </ColumnQ>
        <ColumnQ n={3} question={questions[2]}>
          <InkToggle value={answers.inviteAgain} onChange={(v) => onChange('inviteAgain', v)} />
        </ColumnQ>
        <ColumnQ n={4} question={questions[3]}>
          <PressTags
            options={AUDIENCES}
            value={answers.audience}
            onChange={(v) => onChange('audience', v as Audience | null)}
          />
        </ColumnQ>
        <ColumnQ n={5} question={questions[4]}>
          <PressTextarea
            value={answers.question}
            onChange={(v) => onChange('question', v)}
            rows={3}
            placeholder="Twoje pytanie…"
          />
        </ColumnQ>
        <ColumnQ n={6} question={questions[5]}>
          <PressTextarea
            value={answers.notes}
            onChange={(v) => onChange('notes', v)}
            rows={4}
            placeholder="Uwagi, sugestie, wrażenia…"
          />
        </ColumnQ>
      </div>

      {/* === Dolny CTA: magenta, editorial === */}
      <div className="px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => (isLast ? onHome() : onNext())}
          className="group flex h-14 w-full items-center justify-center gap-3 border-2 border-[#1A1A1A] bg-[#A8336B] font-playfair text-[18px] font-bold italic text-white transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[0_8px_0_-2px_#1A1A1A] active:translate-y-0"
        >
          {isLast ? 'Zakończ ocenę' : 'Następny prelegent'}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* === SLIDE-UP BIO SHEET — duże zdjęcie + drop-cap === */}
      {createPortal(
        <AnimatePresence>
          {bioOpen && (
            <motion.div
              key="czubkowska-bio-sheet"
              className="fixed inset-0 z-[90] flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.button
                type="button"
                aria-label="Zamknij"
                onClick={() => setBioOpen(false)}
                className="absolute inset-0 cursor-default bg-[#1A1A1A]/65 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 240 }}
                className="absolute bottom-0 flex max-h-[94dvh] w-full max-w-[440px] flex-col overflow-hidden border-t-4 border-[#A8336B] bg-[#FAF4EA] shadow-[0_-30px_60px_-10px_rgba(0,0,0,0.5)]"
              >
                {/* DUŻE zdjęcie u góry */}
                <div className="relative shrink-0 bg-[#1A1A1A]">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    draggable={false}
                    style={{ ...PHOTO_FX, objectPosition: speaker.focus ?? '50% 22%' }}
                    className="aspect-[4/5] max-h-[58dvh] w-full object-cover"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(168,51,107,0.30), rgba(26,26,26,0.10))',
                      mixBlendMode: 'multiply',
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                      mixBlendMode: 'overlay',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setBioOpen(false)}
                    aria-label="Zamknij bio"
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A]/55 text-white backdrop-blur-md transition-colors hover:bg-[#A8336B]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-5 pb-5 pt-14">
                    <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.36em] text-white/85">
                      Sylwetka · Dziennikarka
                    </p>
                    <h2 className="mt-1 font-playfair text-[30px] font-bold leading-[0.95] text-white">
                      {speaker.name}
                    </h2>
                  </div>
                </div>

                {/* bio z drop-cap na pierwszej literze */}
                <div className="space-y-3 overflow-y-auto px-6 py-6">
                  {speaker.bio.split('\n').map((para, i) => (
                    <p
                      key={i}
                      className={cn(
                        'font-sans text-[14.5px] leading-relaxed text-[#2B2B2B]',
                        i === 0 &&
                          'first-letter:float-left first-letter:mr-2 first-letter:font-playfair first-letter:text-[54px] first-letter:font-bold first-letter:leading-[0.85] first-letter:text-[#A8336B]',
                      )}
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

/* ---------------------------------------------------------------------------
 * Atomy WYŁĄCZNIE dla Czubkowskiej — własne, magazynowe.
 * ------------------------------------------------------------------------- */

function PressNav({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'flex h-10 w-10 items-center justify-center border-2 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8336B]/40',
        disabled
          ? 'cursor-not-allowed border-[#1A1A1A]/10 text-[#1A1A1A]/15'
          : 'border-[#1A1A1A] bg-[#FAF4EA] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white active:scale-95',
      )}
    >
      {children}
    </button>
  )
}

/** Pytanie w „columnowej" karcie — gruby ink-border + magenta marker. */
function ColumnQ({
  n,
  question,
  children,
}: {
  n: number
  question: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border-2 border-[#1A1A1A] bg-[#FFFBF3] p-5"
    >
      <div className="flex items-start gap-3 border-b border-[#1A1A1A]/15 pb-3">
        <span
          className="font-playfair text-[22px] font-bold italic leading-none"
          style={{ color: MAGENTA }}
        >
          № {String(n).padStart(2, '0')}
        </span>
        <h3 className="font-playfair text-[17px] font-medium leading-tight text-[#1A1A1A]">
          {question}
        </h3>
      </div>
      <div className="pt-4">{children}</div>
    </motion.div>
  )
}

/** Skala — „prasa": kreski jak na maszynie do pisania, klik ustawia, akcent magenta. */
function PressScale({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number | null) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const ref = hover ?? value
  const items = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div>
      <div className="mb-2 flex items-end justify-between font-grotesk">
        <span className="text-[10px] uppercase tracking-[0.24em] text-[#1A1A1A]/55">
          ocena
        </span>
        <span
          className="font-playfair text-[24px] font-bold leading-none tabular-nums"
          style={{ color: MAGENTA }}
        >
          {value ?? '—'}
          <span className="text-[12px] text-[#1A1A1A]/55">/10</span>
        </span>
      </div>
      <div
        className="flex items-stretch gap-[5px]"
        onMouseLeave={() => setHover(null)}
      >
        {items.map((n) => {
          const on = ref != null && n <= ref
          const isHead = n === (hover ?? value)
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n === value ? null : n)}
              className={cn(
                'h-11 flex-1 border-2 font-grotesk text-[12px] font-bold tabular-nums transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8336B]/40',
                on
                  ? 'border-[#A8336B] bg-[#A8336B] text-white'
                  : 'border-[#1A1A1A]/25 bg-white text-[#1A1A1A]/60 hover:border-[#1A1A1A]',
                isHead && on && 'border-[#1A1A1A]',
              )}
            >
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Tak / Nie — gruby ink toggle z wypełnieniem magenta. */
function InkToggle({
  value,
  onChange,
}: {
  value: 'tak' | 'nie' | null
  onChange: (v: 'tak' | 'nie' | null) => void
}) {
  const opts: { value: 'tak' | 'nie'; label: string }[] = [
    { value: 'tak', label: 'Tak' },
    { value: 'nie', label: 'Nie' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {opts.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? null : opt.value)}
            className={cn(
              'h-12 border-2 font-playfair text-[18px] font-bold italic transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8336B]/40',
              active
                ? 'border-[#A8336B] bg-[#A8336B] text-white'
                : 'border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** Tagi — prasowe, kanciaste, ink + magenta accent. */
function PressTags({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(active ? null : opt)}
            className={cn(
              'border-2 px-3 py-2 font-grotesk text-[12px] font-bold uppercase tracking-[0.06em] transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8336B]/40',
              active
                ? 'border-[#A8336B] bg-[#A8336B] text-white'
                : 'border-[#1A1A1A]/25 bg-white text-[#1A1A1A]/70 hover:border-[#1A1A1A] hover:text-[#1A1A1A]',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function PressTextarea({
  value,
  onChange,
  rows,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  rows: number
  placeholder: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none border-2 border-[#1A1A1A]/25 bg-white p-3.5 font-playfair text-[16px] italic text-[#1A1A1A] placeholder:text-[#1A1A1A]/35 focus:border-[#A8336B] focus:outline-none focus:ring-2 focus:ring-[#A8336B]/20"
    />
  )
}
