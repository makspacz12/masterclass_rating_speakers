'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { ActionButton } from '@/components/ui/action-button'
import { useTiltControl } from '@/hooks/useTiltControl'

const ROBOT_SCENE =
  'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export default function LandingPage() {
  const stageRef = useRef<HTMLDivElement>(null)
  const { isTouch, state: tiltState, enableGyro } = useTiltControl(stageRef)
  // gdy user wybierze „Później" — nie pokazuj okienka aż do reloadu (a i tak
  // dostanie pigułkę „Aktywuj przechylanie" przy przyciskach).
  const [permissionDismissed, setPermissionDismissed] = useState(false)
  const showPermissionSheet =
    isTouch && tiltState === 'idle' && !permissionDismissed

  // komunikaty per stan — diagnostyka dla użytkownika (głównie iPhone)
  const tiltMsg: Record<string, string> = {
    idle: '↻ Dotknij, aby włączyć przechylanie',
    'awaiting-permission': '… Pytam o zgodę na sensor',
    'permission-denied': '✗ Brak zgody — Ustawienia → Safari → Ruch i orientacja',
    'awaiting-events': '… Czekam na sensor',
    'no-events': '⚠ Brak danych — odśwież stronę',
    'insecure-context': '🔒 Otwórz przez HTTPS (tunel: cloudflared / ngrok)',
  }
  const showTiltPill =
    isTouch && tiltState !== 'active' && tiltState !== 'unsupported'

  return (
    <div
      className="relative flex h-[100dvh] w-full items-center justify-center bg-[#070A12]"
      onPointerDown={() => {
        // jakikolwiek pierwszy dotyk na landingu → próba aktywacji (gest = wymóg iOS)
        if (isTouch && tiltState === 'idle') void enableGyro()
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
            {/* Status żyroskopu (telefon) — widoczny gdy nie aktywny.
                Kliknięcie próbuje aktywować (potrzebny gest dla iOS). */}
            {showTiltPill && (
              <button
                type="button"
                onClick={() => {
                  if (tiltState === 'idle') void enableGyro()
                }}
                disabled={
                  tiltState === 'awaiting-permission' ||
                  tiltState === 'awaiting-events'
                }
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10.5px] font-medium uppercase tracking-[0.18em] text-slate-200/85 backdrop-blur-md transition-colors hover:bg-white/[0.08] disabled:opacity-60"
              >
                {tiltMsg[tiltState] ?? ''}
              </button>
            )}
            <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-slate-400/75">
              Kim jesteś? Wybierz opcję, aby zacząć ocenę
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                variant="gold"
                label="Doświadczony Lider"
                onClick={() => {
                  window.location.hash = '/ocena'
                }}
              />
              <ActionButton
                variant="platinum"
                label="Młody Talent"
                onClick={() => {
                  window.location.hash = '/ocena'
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Wysuwana z dołu prośba o zgodę na żyroskop (iPhone, stan 'idle') */}
        <AnimatePresence>
          {showPermissionSheet && (
            <motion.div
              key="gyro-permission"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-40 flex items-end"
            >
              <motion.button
                type="button"
                aria-label="Zamknij"
                onClick={() => setPermissionDismissed(true)}
                className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 280 }}
                className="relative w-full overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#0E1322] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3"
              >
                <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/20" />
                <h3 className="text-center font-display text-[18px] font-bold text-white">
                  Włącz przechylanie telefonu
                </h3>
                <p className="mt-2 text-center text-[13px] leading-relaxed text-slate-300/80">
                  Robot 3D będzie reagował na przechył telefonu. Potrzebujemy
                  zgody na czujnik ruchu i orientacji.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => void enableGyro()}
                    className="h-12 rounded-xl bg-gradient-to-b from-[#E6C77E] via-[#D4AD5C] to-[#C9A14A] text-[14px] font-semibold uppercase tracking-[0.12em] text-[#17110A] transition-transform active:scale-[0.98]"
                  >
                    Zezwól
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermissionDismissed(true)}
                    className="h-10 rounded-xl border border-white/10 bg-transparent text-[12px] uppercase tracking-[0.18em] text-slate-300/70 transition-colors hover:bg-white/[0.04]"
                  >
                    Później
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
