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

  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

  // Zakres przechylenia (w stopniach) odwzorowany na pełną szerokość/wysokość.
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const gamma = e.gamma ?? 0 // -90..90  (lewo / prawo)
    const beta = e.beta ?? 45 // -180..180 (przód / tył), ~45 = naturalny chwyt
    const range = 32

    const nx = 0.5 + clamp(gamma, -range, range) / range / 2
    const ny = 0.5 + clamp(beta - 45, -range, range) / range / 2

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
    window.addEventListener('deviceorientation', handleOrientation, true)
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop)
    setGyroActive(true)
  }, [handleOrientation, loop])

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
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [isTouch, startListening, handleOrientation])

  return { isTouch, gyroActive, enableGyro }
}
