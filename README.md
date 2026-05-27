# Masterclass Leadership — Landing Page

Dynamiczny landing page w formacie iPhone'a dla wydarzenia **Masterclass Leadership**
(motyw 2025: *„A-mortality vs Technology"*, Tyniec & ICE Kraków).

Stack: **Vite + React + TypeScript + Tailwind CSS** (struktura shadcn: `components/ui`, `lib/utils`).

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:5173  (+ adres sieciowy do testu na telefonie)
npm run build    # produkcyjny build do /dist
npm run preview  # podgląd builda
```

## Co jest na stronie

- **Robot 3D (Spline)** w centrum — interaktywny:
  - **Desktop / mysz** → robot śledzi kursor (wbudowane zachowanie sceny).
  - **Telefon / żyroskop** → robot reaguje na **przechylanie urządzenia**
    (`src/hooks/useTiltControl.ts` zamienia `deviceorientation` na zdarzenia
    pointer dla canvasu). iOS prosi o zgodę przy pierwszym dotknięciu ekranu.
- Animowane tło (`background-paths`, framer-motion), spotlight, gradienty w palecie **czerń + cyjan**.
- Tytuł **MASTERCLASS LEADERSHIP** (góra) z animowanym gradientem.
- Dwa przyciski (dół, równolegle):
  - **Doświadczony Lider** (cyjan) · **Młody Talent** (fiolet).
  - Pełne animacje **hover** (zmiana koloru, glow, uniesienie) i **active**
    (efekt wciśnięcia: scale + zjazd + inset). **Na razie nie prowadzą do żadnej akcji.**

## Ważne — test żyroskopu na telefonie

`deviceorientation` działa tylko w **bezpiecznym kontekście (HTTPS lub localhost)**.
Otwarcie adresu sieciowego `http://192.168.x.x:5173` na iPhonie **nie** uruchomi
żyroskopu. Aby przetestować na telefonie, użyj tunelu HTTPS, np.:

```bash
npx localtunnel --port 5173      # lub: ngrok http 5173
```

## Struktura

```
src/
  App.tsx
  components/
    LandingPage.tsx          # kompozycja całości
    ui/
      splite.tsx             # SplineScene (robot 3D)
      spotlight.tsx
      card.tsx
      background-paths.tsx    # animowane tło
      action-button.tsx       # przycisk hover/active
  hooks/
    useTiltControl.ts         # mysz (desktop) + żyroskop (mobile)
  lib/utils.ts                # cn()
```

> Backend celowo pominięty — to wyłącznie statyczny landing page.
