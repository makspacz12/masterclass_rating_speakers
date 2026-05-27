'use client'

import { speakers } from '@/data/speakers'

/**
 * Strona prelegentów. Zdjęcie pokazywane „w całości" (object-contain),
 * pod nim tytuł wystąpienia i biografia. Strona przewijalna.
 * Dane: src/data/speakers.ts; zdjęcia: public/prelegenci/.
 */
export default function SpeakersPage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full justify-center bg-[#070A12]">
      <div className="relative min-h-[100dvh] w-full max-w-[440px] bg-[#070A12]">
        {speakers.length === 0 ? (
          <div className="flex min-h-[100dvh] flex-col items-center justify-center px-8 text-center">
            <p className="font-display text-lg font-semibold text-[#E2D2A6]">
              Brak dodanych prelegentów
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Wrzuć zdjęcie do{' '}
              <code className="text-slate-300">public/prelegenci/</code> i dopisz
              prelegenta w{' '}
              <code className="text-slate-300">src/data/speakers.ts</code>.
            </p>
          </div>
        ) : (
          speakers.map((speaker) => (
            <article key={speaker.id} className="flex flex-col">
              {/* zdjęcie w całości */}
              <div className="flex items-center justify-center bg-black">
                <img
                  src={speaker.photo}
                  alt={speaker.name}
                  className="max-h-[62dvh] w-full object-contain"
                />
              </div>

              {/* treść */}
              <div className="px-6 pb-[max(2.4rem,env(safe-area-inset-bottom))] pt-7">
                <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-slate-400/70">
                  Prelegent
                </p>
                <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-white">
                  {speaker.name}
                </h1>

                {/* tytuł wystąpienia */}
                <div className="mt-5 border-l-2 border-[#C9A14A]/70 pl-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#C9A14A]/80">
                    Tytuł wystąpienia
                  </p>
                  <p className="mt-1.5 font-serif text-xl italic leading-snug text-[#E2D2A6]">
                    {speaker.talkTitle}
                  </p>
                </div>

                {/* bio */}
                <div className="mt-6 space-y-3">
                  {speaker.bio.split('\n').map((para, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-relaxed text-slate-300"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
