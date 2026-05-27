'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { ActionButton } from '@/components/ui/action-button'
import { useTiltControl } from '@/hooks/useTiltControl'

const ROBOT_SCENE =
  'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export default function LandingPage() {
  const stageRef = useRef<HTMLDivElement>(null)
  const { isTouch, gyroActive, enableGyro } = useTiltControl(stageRef)

  return (
    <div
      className="relative flex h-[100dvh] w-full items-center justify-center bg-[#070A12]"
      onPointerDown={() => {
        if (isTouch && !gyroActive) void enableGyro()
      }}
    >
      {/* Ramka telefonu (max-w-[440px], pionowy format iPhone'a) */}
      <div className="relative h-full w-full max-w-[440px] overflow-hidden bg-[#070A12]">
        {/* warstwa: gradienty tła (ciepłe złoto u góry, chłodna platyna u dołu) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(95%_55%_at_50%_112%,rgba(159,184,200,0.14),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0)_45%,rgba(7,10,18,0.9)_100%)]" />
        </div>

        {/* warstwa: animowane ścieżki */}
        <BackgroundPaths />

        {/* warstwa: spotlight (ciepły) */}
        <Spotlight
          className="-top-28 left-1/2 -translate-x-1/2 md:-top-20"
          fill="#C6D6E0"
        />

        {/* ROBOT 3D — interaktywny (mysz / żyroskop), zmniejszony do ~0,75 i obniżony,
            tak aby tytuł znalazł się NAD nim, a robot nie wychodził poza kadr */}
        <div
          ref={stageRef}
          className="absolute inset-x-0 bottom-0 top-[16%] z-10 translate-y-[2%] scale-[0.95]"
        >
          <SplineScene
            scene={ROBOT_SCENE}
            className="h-full w-full [&>canvas]:!h-full [&>canvas]:!w-full"
          />
        </div>

        {/* GÓRA: nagłówek (przepuszcza kursor do robota) */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-7 pt-[max(2.6rem,env(safe-area-inset-top))] text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-[20rem] text-[10px] font-medium uppercase leading-relaxed tracking-[0.16em] text-slate-400/70"
          >
            Artificial Intelligence, Neurotechnology, and the Struggle for Human Autonomy
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-[clamp(2rem,10vw,2.9rem)] font-extrabold leading-[0.92] tracking-[-0.01em]"
          >
            <span className="block bg-gradient-to-b from-[#F4F7FA] via-[#D7E0E8] to-[#A9BBC9] bg-clip-text text-transparent">
              MASTERCLASS
            </span>
            <span className="mt-1 block animate-shimmer bg-[linear-gradient(110deg,#B58E3E,38%,#F4E2B0,50%,#B58E3E)] bg-[length:200%_auto] bg-clip-text text-transparent">
              LEADERSHIP
            </span>
          </motion.h1>

          {/* podtytuł: Ocena prelegentów (z cienkimi liniami po bokach) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-4 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A14A]/60" />
            <span className="font-display text-[17px] font-medium tracking-[0.06em] text-[#E2D2A6]/90">
              Ocena prelegentów
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A14A]/60" />
          </motion.div>
        </header>

        {/* DÓŁ: dwa przyciski (scrim oddziela je od robota, brak nachodzenia) */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#070A12] via-[#070A12]/88 to-transparent px-5 pb-[max(1.7rem,env(safe-area-inset-bottom))] pt-12">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-slate-400/75">
              Kim jesteś? Wybierz, aby zacząć ocenę
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                variant="gold"
                label="Doświadczony Lider"
                sublabel="Z doświadczeniem i dorobkiem"
                onClick={() => {
                  window.location.hash = '/ocena'
                }}
              />
              <ActionButton
                variant="platinum"
                label="Młody Talent"
                sublabel="Na początku swojej drogi"
                onClick={() => {
                  window.location.hash = '/ocena'
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
