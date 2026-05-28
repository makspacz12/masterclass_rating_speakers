'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, ArrowRight, Plus, LayoutGrid } from 'lucide-react'
import type { Speaker } from '@/data/speakers'
import type { Answers, Audience } from '@/data/evaluation'
import { AUDIENCES } from '@/data/evaluation'
import { cn } from '@/lib/utils'
import { GoldDeck } from '@/components/menus/GoldDeck'

/**
 * WIDOK PRELEGENTA #5 — Jarosław Królewski (WYJĄTEK, pełna izolacja).
 *
 * Kompletnie inny od pozostałych: ciemny motyw z landingu (granat #070A12 + złoto
 * / platyna), inny układ (full-bleed hero, panele „glass"), inne przyciski (złoty
 * gradient + okrągłe ghosty), inne animacje (wjazd z boku + blur, świetlny puls na
 * skali, przesuwany „thumb" w przełączniku). Nie używa współdzielonych atomów
 * (`scale-rating`, `segmented`, `chip-select`, `SpeakerCard`) — wszystko własne,
 * żeby zmiana nie dotknęła żadnego innego prelegenta.
 */

interface KrolewskiRatingProps {
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

export default function KrolewskiRating({
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
}: KrolewskiRatingProps) {
  const [bioOpen, setBioOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-[100dvh] overflow-hidden text-platinum-light">
      {/* === Tło: głęboki granat + złota poświata (jak landing) === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#070A12]" />
        <div className="absolute -left-24 top-[-10%] h-72 w-72 rounded-full bg-gold/15 blur-[90px]" />
        <div className="absolute -right-20 top-[34%] h-64 w-64 rounded-full bg-platinum/10 blur-[80px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* === Nagłówek nawigacji (inny: ghost-koła + złota poświata) === */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="absolute inset-0 -z-10 bg-[#070A12]/70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <GhostNav onClick={onPrev} disabled={isFirst} ariaLabel="Poprzedni prelegent">
          <ChevronLeft className="h-5 w-5" />
        </GhostNav>

        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-[12px] font-semibold text-platinum-light transition-colors hover:bg-white/[0.04]"
          >
            <Home className="h-3.5 w-3.5 text-gold-light" />
            Strona główna
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="mt-1 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/[0.1] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light shadow-[0_0_16px_-6px_rgba(201,161,74,0.7)] transition-colors hover:border-gold hover:bg-gold/20"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Galeria · {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </button>
        </div>

        <GhostNav onClick={onNext} disabled={isLast} ariaLabel="Następny prelegent">
          <ChevronRight className="h-5 w-5" />
        </GhostNav>
      </header>

      {/* === HERO: zdjęcie full-bleed z napisami na obrazie === */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative"
      >
        <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
          <motion.img
            src={speaker.photo}
            alt={speaker.name}
            draggable={false}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            style={{ objectPosition: speaker.focus ?? '50% 30%' }}
            className="h-full w-full object-cover"
          />
          {/* przyciemnienie pod tekst */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[#070A12]/35 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_120%,rgba(7,10,18,0.9),transparent)]" />

          {/* napisy na dole zdjęcia */}
          <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="text-[10px] font-semibold uppercase tracking-[0.42em] text-gold-light"
            >
              Prelegent
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
              className="mt-2 font-grotesk text-[34px] font-bold leading-[1.04] tracking-[-0.02em] text-white"
            >
              {speaker.name}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              className="mt-4 h-px w-full origin-left bg-gradient-to-r from-gold via-gold-light/60 to-transparent"
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="mt-4 font-serif text-[20px] italic leading-snug text-platinum-light/90"
            >
              „{speaker.talkTitle}"
            </motion.p>
          </div>
        </div>

        {/* przycisk bio — cienki link ze złotą strzałką */}
        <div className="px-6 pt-5">
          <button
            type="button"
            onClick={() => setBioOpen((v) => !v)}
            className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-light"
          >
            {bioOpen ? 'Zwiń sylwetkę' : 'Poznaj sylwetkę'}
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
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-4">
                  {speaker.bio.split('\n').map((para, i) => (
                    <p
                      key={i}
                      className="text-[14px] leading-relaxed text-platinum/80"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* === Separator sekcji pytań === */}
      <div className="mt-9 flex items-center gap-3 px-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-light">
          Oceń wystąpienie
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
      </div>

      {/* === Pytania === */}
      <div className="mt-6 space-y-5 px-6 pb-8">
        <KPanel index={1} question={questions[0]}>
          <GoldScale value={answers.overall} onChange={(v) => onChange('overall', v)} />
        </KPanel>

        <KPanel index={2} question={questions[1]}>
          <GoldScale
            value={answers.substance}
            onChange={(v) => onChange('substance', v)}
          />
        </KPanel>

        <KPanel index={3} question={questions[2]}>
          <ToggleYesNo
            value={answers.inviteAgain}
            onChange={(v) => onChange('inviteAgain', v)}
          />
        </KPanel>

        <KPanel index={4} question={questions[3]}>
          <GoldChips
            options={AUDIENCES}
            value={answers.audience}
            onChange={(v) => onChange('audience', v as Audience | null)}
          />
        </KPanel>

        <KPanel index={5} question={questions[4]}>
          <KTextarea
            value={answers.question}
            onChange={(v) => onChange('question', v)}
            rows={3}
            placeholder="Twoje pytanie…"
          />
        </KPanel>

        <KPanel index={6} question={questions[5]}>
          <KTextarea
            value={answers.notes}
            onChange={(v) => onChange('notes', v)}
            rows={4}
            placeholder="Uwagi, sugestie, wrażenia…"
          />
        </KPanel>
      </div>

      {/* === Dolny CTA (inny: złoty gradient + shimmer) === */}
      <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => (isLast ? onHome() : onNext())}
          className={cn(
            'group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full',
            'bg-gradient-to-r from-gold-deep via-gold to-gold-light text-[16px] font-semibold text-[#1a1407]',
            'shadow-[0_16px_40px_-12px_rgba(201,161,74,0.6)] transition-all duration-300 ease-out',
            'hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.985]',
          )}
        >
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)] transition-transform duration-700 group-hover:translate-x-full"
          />
          {isLast ? 'Zakończ ocenę' : 'Następny prelegent'}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </button>
      </div>

      <GoldDeck
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

/* ----------------------------------------------------------------------------
 * Atomy WYŁĄCZNIE dla Królewskiego (ciemne, złote) — własne, nie współdzielone.
 * -------------------------------------------------------------------------- */

function GhostNav({
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
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        disabled
          ? 'cursor-not-allowed border-white/[0.06] text-white/20'
          : 'border-gold/30 bg-white/[0.03] text-gold-light hover:border-gold/70 hover:bg-gold/10 active:scale-95',
      )}
    >
      {children}
    </button>
  )
}

/** Panel pytania: wjazd z boku + blur (inna animacja niż ScrollReveal). */
function KPanel({
  index,
  question,
  children,
}: {
  index: number
  question: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 36, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm"
    >
      {/* złoty pasek akcentu po lewej */}
      <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-gold-light via-gold to-transparent" />
      <div className="flex items-start gap-3">
        <span className="font-display text-[26px] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,161,74,0.55)]">
          {String(index).padStart(2, '0')}
        </span>
        <h3 className="mt-1 text-[16px] font-semibold leading-snug text-platinum-light">
          {question}
        </h3>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  )
}

/** Skala 1–10 — ciemna, ze złotym wypełnieniem i świetlnym pulsem na wybranej. */
function GoldScale({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number | null) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const downValueRef = useRef<number | null>(null)
  const reference = hover ?? value ?? 0
  const endpoint = hover ?? value
  const items = Array.from({ length: 10 }, (_, i) => i + 1)

  // Wartość spod wskaźnika (X) — pozwala oceniać przeciągnięciem palca/myszy.
  const valueFromX = (clientX: number): number | null => {
    const el = rowRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return Math.min(10, Math.max(1, Math.ceil(ratio * 10)))
  }

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const n = valueFromX(e.clientX)
    if (n == null) return
    draggingRef.current = true
    movedRef.current = false
    downValueRef.current = value
    e.currentTarget.setPointerCapture(e.pointerId)
    setHover(n)
    onChange(n)
  }
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const n = valueFromX(e.clientX)
    if (n == null) return
    movedRef.current = true
    setHover(n)
    if (n !== value) onChange(n)
  }
  const handleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const n = valueFromX(e.clientX)
    setHover(null)
    // czysty tap w już wybraną wartość = odznacz
    if (!movedRef.current && n != null && n === downValueRef.current) {
      onChange(null)
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-platinum/50">
          przeciągnij lub dotknij
        </span>
        <span className="font-display text-[28px] font-extrabold leading-none text-gold-light tabular-nums">
          {value ?? '—'}
          <span className="text-[14px] text-platinum/40">/10</span>
        </span>
      </div>
      {/* Pasek skali — obsługa przeciągania (pointer) + dotyk; touch-none, by
          przeciąganie w poziomie nie scrollowało strony. */}
      <div
        ref={rowRef}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        className="flex touch-none select-none items-stretch gap-[5px]"
      >
        {items.map((n) => {
          const filled = n <= reference
          const isEndpoint = n === endpoint
          return (
            <motion.div
              key={n}
              aria-hidden
              animate={{ scale: isEndpoint ? 1.14 : 1 }}
              transition={{ type: 'spring', stiffness: 460, damping: 17 }}
              className={cn(
                'flex h-11 flex-1 items-center justify-center rounded-md border text-[14px] font-semibold tabular-nums transition-colors duration-200',
                filled
                  ? 'border-transparent bg-gradient-to-b from-gold-light to-gold text-[#1a1407]'
                  : 'border-white/10 bg-white/[0.03] text-platinum/55',
                isEndpoint &&
                  filled &&
                  'z-10 shadow-[0_0_18px_2px_rgba(201,161,74,0.55)]',
              )}
            >
              {n}
            </motion.div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-platinum/40">
        <span>1 — słaba</span>
        <span>10 — najwyższa</span>
      </div>
    </div>
  )
}

/** Tak / Nie — przesuwany „thumb" (inna mechanika niż grid). */
function ToggleYesNo({
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
    <div className="relative grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
      {value && (
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 480, damping: 34 }}
          className={cn(
            'absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-light shadow-[0_0_20px_-2px_rgba(201,161,74,0.6)]',
            value === 'tak' ? 'left-1' : 'left-[calc(50%+0px)]',
          )}
        />
      )}
      {opts.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? null : opt.value)}
            className={cn(
              'relative z-10 h-11 rounded-full text-[15px] font-semibold transition-colors duration-200',
              active ? 'text-[#1a1407]' : 'text-platinum/60 hover:text-platinum-light',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** Chipy — ciemne, obrysowane złotem; aktywny wypełnia się. */
function GoldChips({
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
              'rounded-full border px-4 py-2.5 text-[13.5px] font-medium transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
              active
                ? 'border-transparent bg-gradient-to-r from-gold to-gold-light text-[#1a1407] shadow-[0_0_18px_-4px_rgba(201,161,74,0.7)]'
                : 'border-gold/25 bg-white/[0.02] text-platinum/70 hover:-translate-y-[1px] hover:border-gold/60 hover:text-gold-light',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/** Pole tekstowe — ciemne, ze złotym focusem. */
function KTextarea({
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
      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-[15px] text-platinum-light placeholder:text-platinum/35 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
    />
  )
}
