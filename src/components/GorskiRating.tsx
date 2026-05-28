'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, ArrowRight, Plus, Compass } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import type { Answers, Audience } from '@/data/evaluation'
import { AUDIENCES } from '@/data/evaluation'
import { cn } from '@/lib/utils'
import { OrbitMap } from '@/components/menus/OrbitMap'

/**
 * WIDOK PRELEGENTA #3 — Krzysztof M. Górski (WYJĄTEK, pełna izolacja).
 *
 * Kompletnie inny od pozostałych: motyw „kosmiczny / obserwatorium" (astrofizyk,
 * twórca HEALPix). Ciemny granat z gwiazdami i mgławicą, chłodny fiolet/periwinkle,
 * typografia monospace + grotesk, okrągłe „planetarne" zdjęcie, panele „Q01" jak
 * w karcie obserwacyjnej, skala jako pasek sygnału (rosnące słupki). Własne atomy —
 * nie współdzieli niczego z innymi prelegentami.
 */

interface GorskiRatingProps {
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
  speakers: Speaker[]
  currentId: string
  onJumpTo: (id: string) => void
}

const EASE = [0.22, 1, 0.36, 1] as const
const VIOLET = '#8E8CFF'

export default function GorskiRating({
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
  speakers,
  currentId,
  onJumpTo,
}: GorskiRatingProps) {
  const [bioOpen, setBioOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#05060F] font-spacemono text-[#C5CEE6]">
      {/* === Tło: gwiazdy + mgławica === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 75% 18%, rgba(255,255,255,0.55), transparent), radial-gradient(1.4px 1.4px at 45% 62%, rgba(199,210,255,0.7), transparent), radial-gradient(1px 1px at 88% 70%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 60% 88%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 12% 80%, rgba(255,255,255,0.45), transparent)',
          }}
        />
        <div className="absolute -left-24 top-[-8%] h-72 w-72 rounded-full bg-[#6E6CE0]/20 blur-[100px]" />
        <div className="absolute -right-24 top-[40%] h-72 w-72 rounded-full bg-[#3E8FB0]/15 blur-[100px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05060F] to-transparent" />
      </div>

      {/* === Nawigacja === */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <div className="absolute inset-0 -z-10 bg-[#05060F]/70 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <OrbitNav onClick={onPrev} disabled={isFirst} ariaLabel="Poprzedni prelegent">
          <ChevronLeft className="h-5 w-5" />
        </OrbitNav>
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-[12px] font-bold tracking-[0.04em] text-[#C5CEE6] transition-colors hover:bg-white/[0.04]"
          >
            <Home className="h-3.5 w-3.5" style={{ color: VIOLET }} />
            Strona główna
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="mt-1 inline-flex items-center gap-2 rounded-full border border-[#8E8CFF]/60 bg-[#8E8CFF]/10 px-3 py-1 font-spacemono text-[10px] font-bold uppercase tracking-[0.18em] text-[#B7B5FF] shadow-[0_0_18px_-6px_rgba(142,140,255,0.6)] transition-colors hover:border-[#8E8CFF] hover:bg-[#8E8CFF]/20"
          >
            <Compass className="h-3.5 w-3.5" />
            Obs · {pad(index + 1)}/{pad(total)}
          </button>
        </div>
        <OrbitNav onClick={onNext} disabled={isLast} ariaLabel="Następny prelegent">
          <ChevronRight className="h-5 w-5" />
        </OrbitNav>
      </header>

      {/* === HERO: okrągłe „planetarne" zdjęcie === */}
      <section className="px-6 pt-3 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mx-auto h-44 w-44"
        >
          {/* pierścień orbity */}
          <span className="absolute inset-[-10px] rounded-full border border-[#8E8CFF]/25" />
          <span className="absolute inset-[-10px] rounded-full border-t border-[#8E8CFF]/70" />
          <div
            className="h-44 w-44 overflow-hidden rounded-full bg-[#0C1024] shadow-[0_0_60px_-10px_rgba(142,140,255,0.55)]"
            style={{ outline: '1px solid rgba(142,140,255,0.4)' }}
          >
            <img
              src={speaker.photo}
              alt={speaker.name}
              draggable={false}
              style={{ objectPosition: speaker.focus ?? '50% 30%' }}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-6 text-[10px] uppercase tracking-[0.42em] text-[#8E8CFF]"
        >
          Prelegent · Obserwacja
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          className="mt-2 font-grotesk text-[30px] font-bold leading-[1.05] tracking-[-0.01em] text-white"
        >
          {speaker.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
          className="mx-auto mt-4 max-w-[34ch] text-[13px] italic leading-relaxed text-[#9AA6CB]"
        >
          „{speaker.talkTitle}"
        </motion.p>

        {/* bio toggle */}
        <button
          type="button"
          onClick={() => setBioOpen((v) => !v)}
          className="group mx-auto mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8E8CFF]"
        >
          {bioOpen ? 'Zamknij dane' : 'Otwórz dane'}
          <Plus
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              bioOpen && 'rotate-45',
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {bioOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden text-left"
            >
              <div className="mt-4 space-y-3 rounded-xl border border-[#8E8CFF]/15 bg-white/[0.03] p-4">
                {speaker.bio.split('\n').map((para, i) => (
                  <p key={i} className="text-[13px] leading-relaxed text-[#9AA6CB]">
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* === Separator === */}
      <div className="mt-9 flex items-center gap-3 px-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8E8CFF]/40" />
        <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#8E8CFF]">
          // Oceń wystąpienie
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8E8CFF]/40" />
      </div>

      {/* === Pytania === */}
      <div className="mt-6 space-y-4 px-5 pb-8">
        <QPanel n={1} question={questions[0]}>
          <SignalScale value={answers.overall} onChange={(v) => onChange('overall', v)} />
        </QPanel>
        <QPanel n={2} question={questions[1]}>
          <SignalScale value={answers.substance} onChange={(v) => onChange('substance', v)} />
        </QPanel>
        <QPanel n={3} question={questions[2]}>
          <CoolToggle
            value={answers.inviteAgain}
            onChange={(v) => onChange('inviteAgain', v)}
          />
        </QPanel>
        <QPanel n={4} question={questions[3]}>
          <TagSelect
            options={AUDIENCES}
            value={answers.audience}
            onChange={(v) => onChange('audience', v as Audience | null)}
          />
        </QPanel>
        <QPanel n={5} question={questions[4]}>
          <CoolTextarea
            value={answers.question}
            onChange={(v) => onChange('question', v)}
            rows={3}
            placeholder="Twoje pytanie…"
          />
        </QPanel>
        <QPanel n={6} question={questions[5]}>
          <CoolTextarea
            value={answers.notes}
            onChange={(v) => onChange('notes', v)}
            rows={4}
            placeholder="Uwagi, sugestie, wrażenia…"
          />
        </QPanel>
      </div>

      {/* === Dolny CTA === */}
      <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => (isLast ? onHome() : onNext())}
          className="group flex h-14 w-full items-center justify-center gap-2.5 rounded-xl border border-[#8E8CFF]/40 bg-[#8E8CFF]/10 text-[14px] font-bold uppercase tracking-[0.2em] text-[#C9CFFF] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-[#8E8CFF]/80 hover:bg-[#8E8CFF]/20 active:translate-y-0"
        >
          {isLast ? 'Zakończ ocenę' : 'Następny prelegent'}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </button>
      </div>

      <OrbitMap
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        speakers={speakers}
        currentId={currentId}
        onJumpTo={(id) => {
          setMenuOpen(false)
          onJumpTo(id)
        }}
      />
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Atomy WYŁĄCZNIE dla Górskiego (ciemne, kosmiczne) — własne.
 * ------------------------------------------------------------------------- */

function OrbitNav({
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
        'flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E8CFF]/40',
        disabled
          ? 'cursor-not-allowed border-white/[0.06] text-white/20'
          : 'border-[#8E8CFF]/30 bg-white/[0.03] text-[#B7B5FF] hover:border-[#8E8CFF]/70 hover:bg-[#8E8CFF]/10 active:scale-95',
      )}
    >
      {children}
    </button>
  )
}

/** Panel pytania — „karta obserwacyjna" z markerem Q0n i wjazdem od dołu. */
function QPanel({
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
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.55, ease: EASE }}
      className="rounded-xl border border-[#8E8CFF]/15 bg-white/[0.03] p-5 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <span className="font-spacemono text-[13px] font-bold tracking-[0.1em] text-[#8E8CFF]">
          Q{String(n).padStart(2, '0')}
        </span>
        <h3 className="font-grotesk text-[15.5px] font-semibold leading-snug text-[#E6EAF7]">
          {question}
        </h3>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  )
}

/** Skala 1–10 jako „pasek sygnału" — rosnące słupki, klik ustawia wartość. */
function SignalScale({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number | null) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const reference = hover ?? value ?? 0
  const items = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <span className="text-[10px] uppercase tracking-[0.24em] text-[#7E89AE]">
          sygnał
        </span>
        <span className="font-grotesk text-[26px] font-bold leading-none text-[#C9CFFF] tabular-nums">
          {value ?? '—'}
          <span className="text-[13px] text-[#7E89AE]">/10</span>
        </span>
      </div>
      <div
        className="flex items-end gap-[5px]"
        onMouseLeave={() => setHover(null)}
      >
        {items.map((n) => {
          const filled = n <= reference
          const isEndpoint = n === (hover ?? value)
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onClick={() => onChange(n === value ? null : n)}
              style={{ height: 20 + n * 2.6 }}
              className={cn(
                'flex flex-1 items-end justify-center rounded-[4px] border pb-1 text-[10px] font-bold tabular-nums transition-all duration-200 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E8CFF]/40',
                filled
                  ? 'border-transparent bg-gradient-to-t from-[#6E6CE0] to-[#B7B5FF] text-[#0A0B18]'
                  : 'border-[#8E8CFF]/15 bg-white/[0.03] text-[#5C66A0]',
                isEndpoint &&
                  filled &&
                  'shadow-[0_0_16px_2px_rgba(142,140,255,0.55)]',
              )}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] tracking-[0.1em] text-[#7E89AE]">
        <span>1 — słaba</span>
        <span>10 — najwyższa</span>
      </div>
    </div>
  )
}

/** Tak / Nie — chłodny przełącznik. */
function CoolToggle({
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
    <div className="grid grid-cols-2 gap-2.5">
      {opts.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? null : opt.value)}
            className={cn(
              'h-12 rounded-xl border font-grotesk text-[15px] font-semibold transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E8CFF]/40',
              active
                ? 'border-transparent bg-gradient-to-r from-[#6E6CE0] to-[#8E8CFF] text-white shadow-[0_0_20px_-4px_rgba(142,140,255,0.7)]'
                : 'border-[#8E8CFF]/20 bg-white/[0.03] text-[#9AA6CB] hover:border-[#8E8CFF]/60 hover:text-[#C9CFFF]',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** Wybór grupy — tagi z prefiksem #. */
function TagSelect({
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
              'rounded-md border px-3 py-2 font-spacemono text-[12px] transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E8CFF]/40',
              active
                ? 'border-transparent bg-[#8E8CFF]/20 text-[#C9CFFF] shadow-[0_0_16px_-4px_rgba(142,140,255,0.7)]'
                : 'border-[#8E8CFF]/18 bg-white/[0.02] text-[#8C97BD] hover:border-[#8E8CFF]/50 hover:text-[#C9CFFF]',
            )}
          >
            <span className="text-[#8E8CFF]">#</span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/** Pole tekstowe — ciemne, chłodny focus. */
function CoolTextarea({
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
      className="w-full resize-none rounded-xl border border-[#8E8CFF]/20 bg-white/[0.03] p-3.5 font-grotesk text-[15px] text-[#E6EAF7] placeholder:text-[#6E789E] focus:border-[#8E8CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#8E8CFF]/20"
    />
  )
}
