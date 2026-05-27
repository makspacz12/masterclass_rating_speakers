import { useEffect, useState } from 'react'
import LandingPage from '@/components/LandingPage'
import SpeakersPage from '@/components/SpeakersPage'
import RatingFlow from '@/components/RatingFlow'

function getRoute() {
  return window.location.hash.replace(/^#\/?/, '')
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
  if (route === 'ocena') return <RatingFlow />
  if (route === 'prelegenci') return <SpeakersPage />
  return <LandingPage />
}
