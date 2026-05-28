import { lazy, Suspense, useEffect, useState } from 'react'
import LandingPage from '@/components/LandingPage'

// Lazy-loadowane trasy — żeby ewentualny błąd przy ich imporcie (np. brak
// env-varów Supabase w `useQuestions`) NIE wywalał landingu. Landing musi
// renderować się zawsze, nawet bez konfiguracji backendu.
const SpeakersPage = lazy(() => import('@/components/SpeakersPage'))
const RatingFlow = lazy(() => import('@/components/RatingFlow'))

function getRoute() {
  return window.location.hash.replace(/^#\/?/, '')
}

/** Prosty pełnoekranowy loader pasujący do ciemnego motywu landingu. */
function RouteLoader() {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#070A12]">
      <span className="loader" />
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Landing domyślny. „/ocena" — przepływ oceny prelegentów,
  // „/prelegenci" — publiczne profile prelegentów.
  if (route === 'ocena')
    return (
      <Suspense fallback={<RouteLoader />}>
        <RatingFlow />
      </Suspense>
    )
  if (route === 'prelegenci')
    return (
      <Suspense fallback={<RouteLoader />}>
        <SpeakersPage />
      </Suspense>
    )
  return <LandingPage />
}
