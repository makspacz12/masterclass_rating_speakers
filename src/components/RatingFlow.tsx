'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Home, ArrowRight, Users } from 'lucide-react'
import { speakers } from '@/data/speakers'
import { emptyAnswers, type Answers } from '@/data/evaluation'
import SpeakerRating from '@/components/SpeakerRating'
import KrolewskiRating from '@/components/KrolewskiRating'
import GorskiRating from '@/components/GorskiRating'
import MoncarzRating from '@/components/MoncarzRating'
import CzubkowskaRating from '@/components/CzubkowskaRating'
import { SpeakerSwapStage } from '@/components/SpeakerSwapStage'
import { Roster } from '@/components/menus/Roster'
import { speakerThemeVars } from '@/lib/speakerTheme'
import { useQuestions } from '@/hooks/useQuestions'
import { cn } from '@/lib/utils'

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

interface Transition {
  from: number
  to: number
  dir: number
}

export default function RatingFlow() {
  const [index, setIndex] = useState(0)
  const [answersMap, setAnswersMap] = useState<Record<string, Answers>>({})
  // Aktywne przejście (scena „talia kart"). Indeks commitujemy po jego zakończeniu.
  const [transition, setTransition] = useState<Transition | null>(null)

  const total = speakers.length
  const speaker = speakers[index]
  const answers = speaker ? answersMap[speaker.id] ?? emptyAnswers : emptyAnswers
  // Treści pytań pochodzą z Supabase (tabela `pytania`), nie z pliku.
  const questions = useQuestions()

  const update = <K extends keyof Answers>(field: K, value: Answers[K]) => {
    if (!speaker) return
    setAnswersMap((m) => ({
      ...m,
      [speaker.id]: { ...(m[speaker.id] ?? emptyAnswers), [field]: value },
    }))
  }

  const go = (dir: number) => {
    if (transition) return // blokada w trakcie animacji
    const next = clamp(index + dir, 0, total - 1)
    if (next === index) return
    window.scrollTo({ top: 0, behavior: 'auto' })
    setTransition({ from: index, to: next, dir })
  }

  // Skok bezpośredni z menu „spis gości" (deep-jump). Dir liczony z delta.
  const goTo = (targetIndex: number) => {
    if (transition) return
    const next = clamp(targetIndex, 0, total - 1)
    if (next === index) return
    window.scrollTo({ top: 0, behavior: 'auto' })
    setTransition({ from: index, to: next, dir: next > index ? 1 : -1 })
  }
  const handleJumpTo = (id: string) => goTo(speakers.findIndex((s) => s.id === id))

  // Menu „spis gości" w ścieżce wspólnej (Bralczyk i ew. inni bez bespoke widoku).
  const [rosterOpen, setRosterOpen] = useState(false)

  // Powrót do landingu — RatingFlow odmontuje się, więc po ponownym wejściu
  // pytania ładują się od nowa (stan resetuje się).
  const goHome = () => {
    window.location.hash = ''
  }

  const isFirst = index === 0
  const isLast = index === total - 1

  if (!speaker) return null

  // Osobne, kompletnie inne widoki (pełna izolacja):
  //  • Królewski (#5) — ciemny/złoty motyw landingu,
  //  • Górski (#3) — ciemny „kosmiczny / obserwatorium".
  // Reszta prelegentów: jasna ścieżka poniżej.
  const isKrolewski = speaker.id === 'jaroslaw-krolewski'
  const isGorski = speaker.id === 'krzysztof-gorski'
  const isMoncarz = speaker.id === 'piotr-moncarz'
  const isCzubkowska = speaker.id === 'sylwia-czubkowska'
  // Prelegenci z własnym, kompletnie odrębnym widokiem (nie używają motywu --acc).
  const isCustom = isKrolewski || isGorski || isMoncarz || isCzubkowska

  return (
    <div
      className={cn(
        'flex min-h-[100dvh] w-full justify-center',
        isKrolewski
          ? 'bg-[#070A12]'
          : isGorski
            ? 'bg-[#05060F]'
            : isMoncarz
              ? 'bg-[#ECEFF3]'
              : isCzubkowska
                ? 'bg-[#FAF4EA]'
                : 'rating-theme bg-gradient-to-b from-[#FBF8F3] via-[#F6F0E6] to-[#F1E9DB]',
      )}
      style={isCustom ? undefined : speakerThemeVars(speaker.id)}
    >
      <div className="relative w-full max-w-[440px]">
        {isKrolewski ? (
          <KrolewskiRating
            speaker={speaker}
            answers={answers}
            onChange={update}
            questions={questions}
            index={index}
            total={total}
            isFirst={isFirst}
            isLast={isLast}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            onHome={goHome}
            speakers={speakers}
            currentId={speaker.id}
            onJumpTo={handleJumpTo}
          />
        ) : isGorski ? (
          <GorskiRating
            speaker={speaker}
            answers={answers}
            onChange={update}
            questions={questions}
            index={index}
            total={total}
            isFirst={isFirst}
            isLast={isLast}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            onHome={goHome}
            speakers={speakers}
            currentId={speaker.id}
            onJumpTo={handleJumpTo}
          />
        ) : isMoncarz ? (
          <MoncarzRating
            speaker={speaker}
            answers={answers}
            onChange={update}
            questions={questions}
            index={index}
            total={total}
            isFirst={isFirst}
            isLast={isLast}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            onHome={goHome}
            speakers={speakers}
            currentId={speaker.id}
            onJumpTo={handleJumpTo}
          />
        ) : isCzubkowska ? (
          <CzubkowskaRating
            speaker={speaker}
            answers={answers}
            onChange={update}
            questions={questions}
            index={index}
            total={total}
            isFirst={isFirst}
            isLast={isLast}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            onHome={goHome}
            speakers={speakers}
            currentId={speaker.id}
            onJumpTo={handleJumpTo}
          />
        ) : (
          <>
        {/* === Górna nawigacja === */}
        <header className="sticky top-0 z-40 border-b border-[#EBE3D5]/80 bg-[#FBF8F3]/85 px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            {/* baton: poprzedni prelegent */}
            <NavBaton
              onClick={() => go(-1)}
              disabled={isFirst}
              ariaLabel="Poprzedni prelegent"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden xs:inline">Poprzedni</span>
            </NavBaton>

            {/* środek: powrót do strony głównej + licznik (jako trigger menu) */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={goHome}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-[12px] font-semibold text-[#1C1B1F] transition-colors hover:bg-[#F1E7D8]"
              >
                <Home className="h-3.5 w-3.5 text-[var(--acc-strong)]" />
                Strona główna
              </button>
              <button
                type="button"
                onClick={() => setRosterOpen(true)}
                className="mt-1 inline-flex items-center gap-2 rounded-full border border-[var(--acc-strong)]/50 bg-white px-3 py-1 font-serif text-[13px] italic text-[var(--acc-strong)] shadow-[0_2px_8px_-2px_color-mix(in_srgb,var(--acc)_30%,transparent)] transition-colors hover:border-[var(--acc-strong)] hover:bg-[var(--acc-soft)]"
              >
                <Users className="h-3.5 w-3.5" />
                Lista gości · {index + 1}/{total}
              </button>
            </div>

            {/* baton: następny prelegent */}
            <NavBaton
              onClick={() => go(1)}
              disabled={isLast}
              ariaLabel="Następny prelegent"
            >
              <span className="hidden xs:inline">Następny</span>
              <ChevronRight className="h-5 w-5" />
            </NavBaton>
          </div>
        </header>

        {/* === Treść aktualnego prelegenta === */}
        <SpeakerRating
          speaker={speaker}
          answers={answers}
          onChange={update}
          questions={questions}
        />

        {/* === Baton przejścia (dół) === — ukryty dla Bralczyka (nawigacja u góry) */}
        {speaker.id !== 'jerzy-bralczyk' && (
          <div className="px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => (isLast ? goHome() : go(1))}
              className={cn(
                'group flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[var(--acc)] text-[16px] font-semibold text-white',
                'shadow-[0_12px_30px_-10px_color-mix(in_srgb,var(--acc)_70%,transparent)] transition-all duration-300 ease-out',
                'hover:-translate-y-[2px] hover:bg-[var(--acc-strong)] active:translate-y-0 active:scale-[0.985]',
              )}
            >
              {isLast ? 'Zakończ ocenę' : 'Następny prelegent'}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </button>
          </div>
        )}
        <Roster
          open={rosterOpen}
          onClose={() => setRosterOpen(false)}
          speakers={speakers}
          currentId={speaker.id}
          onJumpTo={(id) => {
            setRosterOpen(false)
            handleJumpTo(id)
          }}
        />
          </>
        )}
      </div>

      {/* === Scena przejścia „talia kart" === */}
      {transition && (
        <SpeakerSwapStage
          from={speakers[transition.from]}
          to={speakers[transition.to]}
          dir={transition.dir}
          fromIndex={transition.from}
          toIndex={transition.to}
          total={total}
          onComplete={() => {
            setIndex(transition.to)
            setTransition(null)
          }}
        />
      )}
    </div>
  )
}

function NavBaton({
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
        'flex h-10 items-center gap-1.5 rounded-xl border px-3 text-[14px] font-semibold transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--acc)_40%,transparent)]',
        disabled
          ? 'cursor-not-allowed border-[#EFE8DB] bg-transparent text-[#CFC6B4]'
          : 'border-[#E7DECF] bg-white text-[#3A3730] hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--acc)_45%,transparent)] hover:text-[var(--acc-strong)] active:translate-y-0 active:scale-[0.97]',
      )}
    >
      {children}
    </button>
  )
}
