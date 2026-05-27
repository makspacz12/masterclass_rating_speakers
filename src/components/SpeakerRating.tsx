'use client'

import { useState } from 'react'
import type { Speaker } from '@/data/speakers'
import type { Answers, Audience } from '@/data/evaluation'
import { AUDIENCES } from '@/data/evaluation'
import { SpeakerCard } from '@/components/SpeakerCard'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ScaleRating } from '@/components/ui/scale-rating'
import { Segmented } from '@/components/ui/segmented'
import { ChipSelect } from '@/components/ui/chip-select'

interface SpeakerRatingProps {
  speaker: Speaker
  answers: Answers
  onChange: <K extends keyof Answers>(field: K, value: Answers[K]) => void
}

function QuestionCard({
  index,
  question,
  children,
}: {
  index: number
  question: string
  children: React.ReactNode
}) {
  return (
    <ScrollReveal className="rounded-2xl border border-[#EBE3D5] bg-white/90 p-5 shadow-[0_2px_14px_rgba(28,27,31,0.05)] backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--acc-soft)] text-[12px] font-bold text-[var(--acc-strong)]">
          {index}
        </span>
        <h3 className="font-[family-name:var(--f-ui)] text-[16px] font-semibold leading-snug text-[#1C1B1F]">
          {question}
        </h3>
      </div>
      <div className="mt-4">{children}</div>
    </ScrollReveal>
  )
}

export default function SpeakerRating({
  speaker,
  answers,
  onChange,
}: SpeakerRatingProps) {
  const [bioOpen, setBioOpen] = useState(false)
  // Animacja wciskania skali per-prelegent: Górski „odbicie", Bralczyk „wciśnięcie",
  // pozostali domyślne uniesienie.
  const scaleVariant =
    speaker.id === 'krzysztof-gorski'
      ? 'pop'
      : speaker.id === 'jerzy-bralczyk'
        ? 'inset'
        : 'lift'

  return (
    <div className="px-5 pb-28 pt-5">
      {/* === Widok prelegenta === */}
      <ScrollReveal>
        <SpeakerCard
          speaker={speaker}
          bio={{ open: bioOpen, onToggle: () => setBioOpen((v) => !v) }}
        />
      </ScrollReveal>

      {/* === Pytania (przewijane) === */}
      <div className="mt-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#E7DECF]" />
        <span className="font-[family-name:var(--f-ui)] text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--acc-label)]">
          Oceń wystąpienie
        </span>
        <span className="h-px flex-1 bg-[#E7DECF]" />
      </div>

      <div className="mt-5 space-y-4">
        <QuestionCard index={1} question="Ocena ogólna prelegenta">
          <ScaleRating
            value={answers.overall}
            onChange={(v) => onChange('overall', v)}
            pressVariant={scaleVariant}
          />
        </QuestionCard>

        <QuestionCard
          index={2}
          question="Na ile treść była wartościowa merytorycznie?"
        >
          <ScaleRating
            value={answers.substance}
            onChange={(v) => onChange('substance', v)}
            pressVariant={scaleVariant}
          />
        </QuestionCard>

        <QuestionCard
          index={3}
          question="Czy zaprosił(a)byś tego prelegenta ponownie?"
        >
          <Segmented
            options={[
              { value: 'tak', label: 'Tak' },
              { value: 'nie', label: 'Nie' },
            ]}
            value={answers.inviteAgain}
            onChange={(v) => onChange('inviteAgain', v)}
          />
        </QuestionCard>

        <QuestionCard
          index={4}
          question="Dla kogo to wystąpienie było najbardziej wartościowe?"
        >
          <ChipSelect
            options={AUDIENCES}
            value={answers.audience}
            onChange={(v) => onChange('audience', v as Audience | null)}
          />
        </QuestionCard>

        <QuestionCard
          index={5}
          question="Jakie pytanie zadał(a)byś temu prelegentowi po wystąpieniu?"
        >
          <textarea
            value={answers.question}
            onChange={(e) => onChange('question', e.target.value)}
            rows={3}
            placeholder="Twoje pytanie…"
            className="w-full resize-none rounded-xl border border-[#E7DECF] bg-white p-3.5 font-[family-name:var(--f-body)] text-[15px] text-[#1C1B1F] placeholder:text-[#B6AE9F] focus:border-[color-mix(in_srgb,var(--acc)_50%,transparent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--acc)_20%,transparent)]"
          />
        </QuestionCard>

        <QuestionCard index={6} question="Twoje uwagi na temat wystąpienia">
          <textarea
            value={answers.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            rows={4}
            placeholder="Uwagi, sugestie, wrażenia…"
            className="w-full resize-none rounded-xl border border-[#E7DECF] bg-white p-3.5 font-[family-name:var(--f-body)] text-[15px] text-[#1C1B1F] placeholder:text-[#B6AE9F] focus:border-[color-mix(in_srgb,var(--acc)_50%,transparent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--acc)_20%,transparent)]"
          />
        </QuestionCard>
      </div>
    </div>
  )
}
