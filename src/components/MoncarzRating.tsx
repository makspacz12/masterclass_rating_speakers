'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, ArrowRight } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import type { Answers, Audience } from '@/data/evaluation'
import { AUDIENCES } from '@/data/evaluation'
import { cn } from '@/lib/utils'
import { BlueprintRoster } from '@/components/menus/BlueprintRoster'

/**
 * WIDOK PRELEGENTA #1 — Piotr Moncarz (WYJĄTEK, pełna izolacja).
 *
 * Kompletnie inny od pozostałych: estetyka „inżynierska / blueprint" (Stanford,
 * Dolina Krzemowa, P.E., National Academy of Engineering). Jasne chłodne tło z
 * siatką techniczną, akcent teal, typografia grotesk + monospace, ostre (kanciaste)
 * przyciski, zdjęcie w ramce z narożnikami-celownikami, skala jako precyzyjna
 * „linijka" z suwakiem. Własne atomy — nie współdzieli nic z innymi prelegentami.
 */

interface MoncarzRatingProps {
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
const TEAL = '#0F766E'

export default function MoncarzRating({
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
}: MoncarzRatingProps) {
  const [bioOpen, setBioOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#ECEFF3] font-sans text-[#16202B]">
      {/* === Tło: siatka blueprintu === */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,118,110,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* === Nawigacja === */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[#16202B]/10 bg-[#ECEFF3]/85 px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))] backdrop-blur-md">
        <TechNav onClick={onPrev} disabled={isFirst} ariaLabel="Poprzedni prelegent">
          <ChevronLeft className="h-5 w-5" />
        </TechNav>
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-1.5 px-3 py-1 font-grotesk text-[12px] font-bold text-[#16202B] transition-colors hover:bg-[#16202B]/[0.04]"
          >
            <Home className="h-3.5 w-3.5" style={{ color: TEAL }} />
            Strona główna
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="mt-0.5 inline-flex items-center gap-1 font-spacemono text-[10px] tracking-[0.2em] text-[#0F766E] transition-colors hover:underline"
          >
            PROFIL {pad(index + 1)}/{pad(total)}
            <span aria-hidden>▾</span>
          </button>
        </div>
        <TechNav onClick={onNext} disabled={isLast} ariaLabel="Następny prelegent">
          <ChevronRight className="h-5 w-5" />
        </TechNav>
      </header>

      {/* === HERO: zdjęcie w ramce „technicznej" === */}
      <section className="px-6 pt-6">
        <p className="font-spacemono text-[10px] uppercase tracking-[0.3em] text-[#0F766E]">
          Inżynier · Profil 01
        </p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mt-3"
        >
          {/* narożniki-celowniki */}
          <Corner className="left-0 top-0 border-l-2 border-t-2" />
          <Corner className="right-0 top-0 border-r-2 border-t-2" />
          <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
          <Corner className="bottom-0 right-0 border-b-2 border-r-2" />
          <div className="mx-2 overflow-hidden">
            <img
              src={speaker.photo}
              alt={speaker.name}
              draggable={false}
              style={{ objectPosition: speaker.focus ?? '50% 30%' }}
              className="aspect-[4/5] w-full object-cover grayscale-[0.15] contrast-[1.03]"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-5 font-grotesk text-[32px] font-bold uppercase leading-[0.98] tracking-[-0.01em]"
        >
          {speaker.name}
        </motion.h1>

        {/* tytuł wystąpienia w „callout" z lewą belką */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 border-l-2 border-[#0F766E] bg-white/60 py-2.5 pl-4 pr-3"
        >
          <span className="font-spacemono text-[9px] uppercase tracking-[0.28em] text-[#5B6B7A]">
            Temat
          </span>
          <p className="mt-1 font-grotesk text-[16px] font-semibold leading-snug text-[#16202B]">
            {speaker.talkTitle}
          </p>
        </motion.div>

        {/* bio toggle */}
        <button
          type="button"
          onClick={() => setBioOpen((v) => !v)}
          className="mt-4 flex items-center gap-2 font-spacemono text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F766E]"
        >
          {bioOpen ? '— Zwiń notę' : '+ Rozwiń notę'}
        </button>
        <AnimatePresence initial={false}>
          {bioOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3 border border-[#16202B]/10 bg-white/70 p-4">
                {speaker.bio.split('\n').map((para, i) => (
                  <p key={i} className="text-[13.5px] leading-relaxed text-[#42505C]">
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
        <span className="font-spacemono text-[10px] font-bold uppercase tracking-[0.3em] text-[#0F766E]">
          Ocena wystąpienia
        </span>
        <span className="h-px flex-1 bg-[#16202B]/15" />
      </div>

      {/* === Pytania === */}
      <div className="mt-6 space-y-4 px-5 pb-8">
        <SpecPanel n={1} question={questions[0]}>
          <RulerScale value={answers.overall} onChange={(v) => onChange('overall', v)} />
        </SpecPanel>
        <SpecPanel n={2} question={questions[1]}>
          <RulerScale value={answers.substance} onChange={(v) => onChange('substance', v)} />
        </SpecPanel>
        <SpecPanel n={3} question={questions[2]}>
          <SharpToggle
            value={answers.inviteAgain}
            onChange={(v) => onChange('inviteAgain', v)}
          />
        </SpecPanel>
        <SpecPanel n={4} question={questions[3]}>
          <SharpTags
            options={AUDIENCES}
            value={answers.audience}
            onChange={(v) => onChange('audience', v as Audience | null)}
          />
        </SpecPanel>
        <SpecPanel n={5} question={questions[4]}>
          <SharpTextarea
            value={answers.question}
            onChange={(v) => onChange('question', v)}
            rows={3}
            placeholder="Twoje pytanie…"
          />
        </SpecPanel>
        <SpecPanel n={6} question={questions[5]}>
          <SharpTextarea
            value={answers.notes}
            onChange={(v) => onChange('notes', v)}
            rows={4}
            placeholder="Uwagi, sugestie, wrażenia…"
          />
        </SpecPanel>
      </div>

      {/* === Dolny CTA — ostry przycisk z wypełnieniem od lewej === */}
      <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => (isLast ? onHome() : onNext())}
          className="group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden border-2 border-[#0F766E] bg-transparent font-grotesk text-[14px] font-bold uppercase tracking-[0.12em] text-[#0F766E] transition-colors duration-300"
        >
          <span className="absolute inset-0 -translate-x-full bg-[#0F766E] transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            {isLast ? 'Zakończ ocenę' : 'Następny prelegent'}
          </span>
          <ArrowRight className="relative z-10 h-5 w-5 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
        </button>
      </div>

      <BlueprintRoster
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
 * Atomy WYŁĄCZNIE dla Moncarza (inżynierskie, kanciaste) — własne.
 * ------------------------------------------------------------------------- */

function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('absolute z-10 h-4 w-4 border-[#0F766E]', className)}
    />
  )
}

function TechNav({
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
        'flex h-10 w-10 items-center justify-center border transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40',
        disabled
          ? 'cursor-not-allowed border-[#16202B]/10 text-[#16202B]/20'
          : 'border-[#16202B]/20 bg-white text-[#16202B] hover:border-[#0F766E] hover:text-[#0F766E] active:scale-95',
      )}
    >
      {children}
    </button>
  )
}

/** Panel pytania — „karta specyfikacji": lewa belka rysuje się, treść wchodzi. */
function SpecPanel({
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
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={{ hidden: {}, show: {} }}
      className="relative border border-[#16202B]/10 bg-white p-5"
    >
      {/* rysująca się lewa belka */}
      <motion.span
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute inset-y-0 left-0 w-[3px] origin-top bg-[#0F766E]"
      />
      <motion.div
        variants={{ hidden: { opacity: 0, x: 14 }, show: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
      >
        <div className="flex items-start gap-3">
          <span className="font-spacemono text-[12px] font-bold text-[#0F766E]">
            {String(n).padStart(2, '0')}
          </span>
          <h3 className="font-grotesk text-[15.5px] font-semibold leading-snug text-[#16202B]">
            {question}
          </h3>
        </div>
        <div className="mt-4">{children}</div>
      </motion.div>
    </motion.div>
  )
}

/** Skala 1–10 jako precyzyjna „linijka" z suwakiem (knob animuje pozycję). */
function RulerScale({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number | null) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const ref = hover ?? value
  const items = Array.from({ length: 10 }, (_, i) => i + 1)
  const pct = (n: number) => ((n - 1) / 9) * 100

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <span className="font-spacemono text-[10px] uppercase tracking-[0.22em] text-[#5B6B7A]">
          pomiar
        </span>
        <span className="font-grotesk text-[24px] font-bold leading-none tabular-nums text-[#0F766E]">
          {value ?? '—'}
          <span className="text-[12px] text-[#5B6B7A]">/10</span>
        </span>
      </div>
      <div className="relative h-12" onMouseLeave={() => setHover(null)}>
        {/* tor */}
        <div className="absolute left-1 right-1 top-[14px] h-[2px] bg-[#16202B]/15" />
        {/* wypełnienie */}
        {ref ? (
          <div
            className="absolute left-1 top-[14px] h-[2px] bg-[#0F766E]"
            style={{ width: `calc((100% - 8px) * ${pct(ref) / 100})` }}
          />
        ) : null}
        {/* ticki + numery */}
        <div className="absolute inset-x-1 top-0 flex justify-between">
          {items.map((n) => {
            const on = ref != null && n <= ref
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onClick={() => onChange(n === value ? null : n)}
                className="flex flex-col items-center gap-1 focus:outline-none"
              >
                <span
                  className={cn(
                    'h-[14px] w-[2px] transition-colors duration-150',
                    on ? 'bg-[#0F766E]' : 'bg-[#16202B]/25',
                  )}
                />
                <span
                  className={cn(
                    'font-spacemono text-[10px] tabular-nums transition-colors duration-150',
                    n === value ? 'font-bold text-[#0F766E]' : 'text-[#5B6B7A]',
                  )}
                >
                  {n}
                </span>
              </button>
            )
          })}
        </div>
        {/* suwak (knob) */}
        {value ? (
          <motion.div
            className="absolute top-[14px] h-4 w-4 -translate-x-1/2 -translate-y-1/2 border-2 border-[#0F766E] bg-white"
            initial={false}
            animate={{ left: `calc(4px + (100% - 8px) * ${pct(value) / 100})` }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          />
        ) : null}
      </div>
    </div>
  )
}

/** Tak / Nie — kanciasty przełącznik z wypełnieniem. */
function SharpToggle({
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
              'h-12 border-2 font-grotesk text-[15px] font-bold uppercase tracking-[0.06em] transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40',
              active
                ? 'border-[#0F766E] bg-[#0F766E] text-white'
                : 'border-[#16202B]/20 bg-white text-[#42505C] hover:border-[#0F766E] hover:text-[#0F766E]',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** Wybór grupy — kanciaste tagi. */
function SharpTags({
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
              'border px-3 py-2 font-spacemono text-[12px] transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40',
              active
                ? 'border-[#0F766E] bg-[#0F766E] text-white'
                : 'border-[#16202B]/18 bg-white text-[#42505C] hover:border-[#0F766E] hover:text-[#0F766E]',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/** Pole tekstowe — kanciaste, techniczny focus. */
function SharpTextarea({
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
      className="w-full resize-none border border-[#16202B]/20 bg-white p-3.5 text-[15px] text-[#16202B] placeholder:text-[#9AA7B2] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
    />
  )
}
