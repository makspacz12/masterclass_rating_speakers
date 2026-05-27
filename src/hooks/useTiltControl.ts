import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useTiltControl
 * ---------------
 * Sprawia, że robot Spline „śledzi" użytkownika:
 *  • Desktop / urządzenia z myszą  → ruch kursora obsługuje wbudowane zachowanie
 *    sceny Spline (Look At Pointer). Nie musimy nic robić.
 *  • Telefon / tablet (żyroskop)   → odczytujemy przechylenie urządzenia
 *    (deviceorientation: gamma = lewo/prawo, beta = przód/tył) i syntetyzujemy
 *    zdarzenia `pointermove` na <canvas> sceny, dzięki czemu robot reaguje na
 *    pochylanie telefonu dokładnie tak, jak reagowałby na mysz.
 *
 * iOS 13+ wymaga zgody użytkownika (DeviceOrientationEvent.requestPermission),
 * którą trzeba wywołać w odpowiedzi na gest — stąd funkcja `enableGyro()`.
 *
 * KLUCZOWE poprawki (żeby „w ogóle nie działa" przestało się zdarzać):
 *  • Auto-kalibracja: punkt neutralny bierzemy z PIERWSZEGO odczytu, czyli z tego,
 *    jak telefon jest faktycznie trzymany. Wcześniej sztywne `beta = 45°` powodowało,
 *    że przy normalnym (pionowym) chwycie robot był od razu „przyklejony" do skraju.
 *  • Fallback na `deviceorientationabsolute` — część urządzeń (gł. Android) nie
 *    emituje `deviceorientation`, tylko wariant absolutny.
 */

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export function useTiltControl(
  containerRef: React.RefObject<HTMLElement>,
) {
  const [isTouch, setIsTouch] = useState(false)
  const [gyroActive, setGyroActive] = useState(false)

  // cel (z żyroskopu) oraz aktualnie animowana pozycja kursora
  const target = useRef({ x: 0.5, y: 0.5 })
  const current = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const listeningRef = useRef(false)

  // punkt neutralny ustalony przy pierwszym odczycie (auto-kalibracja chwytu)
  const baseline = useRef<{ gamma: number; beta: number } | null>(null)

  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

  // Zakres przechylenia (w stopniach) odwzorowany na pełną szerokość/wysokość,
  // liczony jako odchylenie od punktu neutralnego (a nie od sztywnych 45°).
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // niektóre urządzenia emitują zdarzenie z nullami zanim sensor się rozgrzeje
    if (e.gamma == null && e.beta == null) return

    const gamma = e.gamma ?? 0 // -90..90  (lewo / prawo)
    const beta = e.beta ?? 0 // -180..180 (przód / tył)

    // pierwszy sensowny odczyt = punkt neutralny (tak, jak trzymasz telefon teraz)
    if (!baseline.current) {
      baseline.current = { gamma, beta }
      setGyroActive(true)
    }

    const range = 28
    const dGamma = clamp(gamma - baseline.current.gamma, -range, range)
    const dBeta = clamp(beta - baseline.current.beta, -range, range)

    const nx = 0.5 + dGamma / range / 2
    const ny = 0.5 + dBeta / range / 2

    target.current = { x: clamp(nx, 0, 1), y: clamp(ny, 0, 1) }
  }, [])

  // Pętla animacji: płynnie dążymy do celu i emitujemy zdarzenia pointer na canvas.
  const loop = useCallback(() => {
    const canvas =
      canvasRef.current ??
      (containerRef.current?.querySelector('canvas') as HTMLCanvasElement | null)
    canvasRef.current = canvas

    if (canvas) {
      // lerp dla płynności
      current.current.x += (target.current.x - current.current.x) * 0.08
      current.current.y += (target.current.y - current.current.y) * 0.08

      const rect = canvas.getBoundingClientRect()
      const clientX = rect.left + rect.width * current.current.x
      const clientY = rect.top + rect.height * current.current.y

      const opts: PointerEventInit & MouseEventInit = {
        clientX,
        clientY,
        bubbles: true,
        cancelable: true,
        view: window,
      }
      canvas.dispatchEvent(
        new PointerEvent('pointermove', { ...opts, pointerType: 'mouse' }),
      )
      canvas.dispatchEvent(new MouseEvent('mousemove', opts))
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [containerRef])

  const startListening = useCallback(() => {
    if (listeningRef.current) return
    listeningRef.current = true
    // główne zdarzenie + fallback (część Androidów emituje tylko wariant absolutny)
    window.addEventListener('deviceorientation', handleOrientation, true)
    window.addEventListener(
      'deviceorientationabsolute',
      handleOrientation as EventListener,
      true,
    )
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop)
  }, [handleOrientation, loop])

  const stopListening = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation, true)
    window.removeEventListener(
      'deviceorientationabsolute',
      handleOrientation as EventListener,
      true,
    )
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    listeningRef.current = false
  }, [handleOrientation])

  /** Wywołaj w reakcji na gest (np. pierwsze dotknięcie) — prosi o zgodę na iOS. */
  const enableGyro = useCallback(async () => {
    if (!isTouchDevice()) return
    const DOE = DeviceOrientationEvent as IOSDeviceOrientationEvent
    try {
      if (typeof DOE?.requestPermission === 'function') {
        const res = await DOE.requestPermission()
        if (res !== 'granted') return
      }
      startListening()
    } catch {
      // brak żyroskopu / odmowa — po cichu pomijamy
    }
  }, [startListening])

  // Android zwykle nie wymaga zgody — startujemy automatycznie.
  useEffect(() => {
    if (!isTouch) return
    const DOE = DeviceOrientationEvent as IOSDeviceOrientationEvent
    if (typeof DOE?.requestPermission !== 'function') {
      startListening()
    }
    return () => stopListening()
  }, [isTouch, startListening, stopListening])

  return { isTouch, gyroActive, enableGyro }
}
