# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Co to jest

Aplikacja webowa (format pionowy iPhone'a) dla wydarzenia **Masterclass Leadership**:
ciemny **landing page** + jasna **strona oceny prelegentów**. Docelowo widzowie
oceniają prelegentów. **Świadomie bez backendu** — stan trzymany lokalnie w pamięci.
Komunikacja z użytkownikiem po polsku.

## Git / GitHub (ważne — rytm commitów)

Repo: **https://github.com/makspacz12/masterclass_rating_speakers** (`origin`, branch `main`).

**Commituj często** — po każdej skończonej, sensownej zmianie (np. nowa sekcja
landingu, dodanie/edycja prelegentów, poprawka layoutu), nie zbieraj wielu zmian
w jeden wielki commit. Po dłuższej pracy lub serii edycji zrób commit i push, żeby
historia była granularna. Krótkie, rzeczowe komunikaty po polsku.

Standardowy cykl: `git add -A` → `git commit -m "..."` → `git push`. Build
(`npm run build`) to bramka jakości — najlepiej przejść go przed commitem.

## TWARDE ZASADY (bezwzględne — od użytkownika)

Te reguły są nadrzędne. Złamanie ich jest **całkowicie zabronione**.

1. **Animacje przejść między prelegentami — izolacja.** Gdy użytkownik prosi o zmianę
   animacji konkretnego przejścia (np. „przejście 2→3"), zmieniaj **wyłącznie** tę
   jedną animację. Wszystkie pozostałe przejścia (np. 1→2, 3→4) zostaw **nietknięte**.
   Każde przejście ma być **inne** — docelowo animacja jest dobierana per para indeksów
   (np. mapowanie `from→to` w `SpeakerSwapStage`/`RatingFlow`), nie jedna wspólna dla
   wszystkich. Nigdy nie „przy okazji" nie modyfikuj innych przejść.

2. **Styl per prelegent — izolacja.** Gdy użytkownik prosi o zmianę stylu danego
   prelegenta, zmieniaj go **tylko dla tego jednego** prelegenta. Nie przenoś tej zmiany
   na pozostałych. Styl ma móc różnić się między prelegentami.

Zasada ogólna: zmieniaj dokładnie to, o co proszono, i nic poza tym.

## Komendy

```bash
npm install
npm run dev      # serwer dev z HMR (port 5188, strictPort — patrz niżej)
npm run build    # tsc --noEmit (typecheck) + vite build → dist/
npm run preview  # podgląd buildu produkcyjnego
```

Brak testów i lintera — `npm run build` to jedyna bramka jakości (czysty
`tsc --noEmit`, nie `tsc -b`; bez referencji projektów). Po zmianach uruchamiaj build.

### Port dev (ważne)

`vite.config.ts`: `port: 5188` + `strictPort: true` (5173/5180 były zajęte przez
inne aplikacje na tej maszynie). Jeśli 5188 też zajęty — znajdź wolny port
programowo i podmień jedną liczbę w configu; **nie ubijaj cudzych procesów node**.

`host: true` — dev-serwer jest wystawiony w LAN (`Network: http://<ip>:5188/`),
co umożliwia test na telefonie w tej samej sieci. Uwaga: po `http://` z LAN-u
żyroskop nie ruszy (potrzebny bezpieczny kontekst — użyj tunelu HTTPS).

## Stack i routing

Vite + React 18 + TypeScript + Tailwind v3, struktura w stylu shadcn (`@/` → `src/`).
Animacje: `framer-motion` (główna) + `motion` (tylko dla `components/ui/folder.tsx`).

**Routing bez biblioteki** — hash w `src/App.tsx` (nasłuch `hashchange`):
- `''` → `LandingPage`
- `#/ocena` → `RatingFlow` (przepływ oceny)
- `#/prelegenci` → `SpeakersPage` (publiczne profile)

Oba przyciski landingu („Doświadczony Lider" / „Młody Talent") ustawiają
`location.hash = '/ocena'` (wcześniej nie prowadziły nigdzie).

## Dwa motywy (celowy kontrast)

- **Landing (ciemny):** granatowa czerń `#070A12` + ciepłe **złoto/szampan** i chłodna
  **platyna** (tokeny `gold`/`platinum` w `tailwind.config.js`). Motyw z researchu
  wydarzenia (Tyniec + ICE Kraków, „A-mortality vs Technology").
- **Strona oceny (jasna):** kremowy papier (`#FBF8F3`…`#F1E9DB`) + akcent **terakotowy
  pomarańcz `#DD7A3B`** (wynika ze złota landingu). Kolory wpisane wprost (hex), nie ma
  dla nich tokenów.
- **Unikać jasnego cyjanu** — odrzucony przez użytkownika jako „za jasny niebieski".

## Landing (`components/LandingPage.tsx`)

Warstwy z jawnym z-index w „ramce telefonu" (`max-w-[440px]`, `overflow-hidden`):
z0 gradienty → z1 `BackgroundPaths` + `Spotlight` → **z10 robot Spline** → z20 nagłówek
(`pointer-events-none`!) i dolne przyciski.

- **Robot 3D** (`components/ui/splite.tsx`, scena Spline `kZDDjO5HuC9GJUM2`):
  - Desktop/mysz → śledzenie wbudowane w scenę, nic nie kodujemy.
  - Telefon/żyroskop → `src/hooks/useTiltControl.ts` czyta `deviceorientation` i
    **syntetyzuje `pointermove`/`mousemove` na `<canvas>`**. Hook zwraca `state`
    (`unsupported` | `insecure-context` | `idle` | `awaiting-permission` |
    `permission-denied` | `awaiting-events` | `no-events` | `active`) — landing
    wyświetla na jego podstawie pigułkę z diagnostyką. iOS wymaga zgody Z GESTU
    (`enableGyro()` na pierwszy dotyk / pigułka „Aktywuj przechylanie"); prosi
    równolegle o zgodę dla `DeviceOrientationEvent` ORAZ `DeviceMotionEvent`.

    **„Nie działa na iPhonie" — kolejność przyczyn (od najczęstszej):**
    1. **Brak HTTPS** — iOS Safari w kontekście nie-bezpiecznym (`http://192.168.x.x:5188`)
       nie udostępnia sensorów. Test na telefonie wymaga HTTPS:
       `cloudflared tunnel --url http://localhost:5188` albo `ngrok http 5188`,
       potem otwórz wygenerowany URL `https://...` na iPhonie.
    2. **Brak zgody** — ekran pokaże „Brak zgody — Ustawienia → Safari → Ruch i orientacja";
       w iOS trzeba zresetować zgodę dla strony (lub odinstalować/zainstalować Safari).
    3. **Ustawienia iOS** — Ustawienia → Safari → „Ruch i orientacja" musi być WŁ.
    4. **WebView w innej apce** (np. otwarcie linka z Messengera) — często blokuje sensory;
       testuj w „natywnym" Safari.
    5. **Sensor nie startuje** — po 2.2 s bez zdarzeń hook ustawia `no-events`;
       pigułka informuje, najczęściej pomaga odświeżenie strony.
  - Rozmiar/pozycja = `scale-[0.75]` + `translate-y-[7%]` na wrapperze.
- **Krytyczne:** nakładki nad canvasem muszą mieć `pointer-events-none` (poza
  przyciskami), inaczej robot przestaje śledzić kursor.
- `main.tsx` **celowo bez `<StrictMode>`** — podwójny montaż sceny Spline zacinał
  śledzenie. Nie przywracać.

## Przepływ oceny (`components/RatingFlow.tsx`)

- `RatingFlow` trzyma `index` (aktualny prelegent), `answersMap`
  (`Record<speakerId, Answers>` — odpowiedzi per prelegent, w pamięci) oraz
  `transition` (aktywna animacja zamiany). Powrót na landing odmontowuje komponent,
  więc **odpowiedzi resetują się** po ponownym wejściu.
- `SpeakerRating` = nagłówek (`SpeakerCard`) + 6 pytań w kartach odsłanianych przy
  scrollu (`components/ui/scroll-reveal.tsx`). Atomy odpowiedzi:
  `scale-rating.tsx` (skala 1–10, **wypełnienie kumulacyjne** 1…n), `segmented.tsx`
  (Tak/Nie), `chip-select.tsx` (wybór grupy — **chipy zamiast dropdownu**, bo overlay
  chował się za kartami).
- **Przejście „talia kart z głębią"** (`components/SpeakerSwapStage.tsx`) — najbardziej
  nieoczywista część:
  - To pełnoekranowa nakładka (`fixed`, `perspective`) pokazywana **tylko w trakcie**
    zamiany. Renderuje dwie `SpeakerCard` animowane keyframe'ami (FROM kurczy się do
    małego prostokąta, zamienia się miejscami z małym prostokątem TO, TO rośnie).
  - **Indeks commitowany dopiero w `onAnimationComplete`** karty TO (potem
    `setTransition(null)`); `go()` blokuje kliknięcia w trakcie.
  - **Bezszwowy handoff** zależy od: (a) tej samej `SpeakerCard` w nagłówku i na scenie,
    (b) statycznej kopii paska nawigacji w scenie — dzięki czemu karta ląduje 1:1 z
    realną stroną. Zmieniając layout nagłówka, zmieniaj `SpeakerCard`, nie duplikuj.
  - Pokrętła: `SMALL` (skala prostokąta w głębi), `DURATION`, `TIMES` (4 fazy).

## Dane i zasoby

- `src/data/speakers.ts` — `Speaker[]` (`name`, `talkTitle`, `bio` z akapitami przez
  `\n`, `photo`). Zdjęcia w **`public/prelegenci/`**, ścieżka jako `'/prelegenci/<plik>'`.
  Jest **testowy prelegent `anna-zielinska`** ze zdjęciem z Unsplash — oznaczony jako
  do usunięcia.
- `src/data/evaluation.ts` — `AUDIENCES`, typ `Answers`, `emptyAnswers`.
- `src/data/foundation.ts` — **obecnie nieużywany** (stopka z wartościami CTN została
  usunięta); zostawiony.

## Scroll

`index.css` ma `overflow-y: auto` na `body` (strony oceny/prelegentów są przewijalne).
Landing nie przewija się, bo mieści się w `h-[100dvh]`. Dodany breakpoint `xs: 380px`
(etykiety batonów nawigacji).

## Komponenty 21st.dev

`components/ui/folder.tsx` i `container-scroll-animation.tsx` wklejone z 21st.dev,
**obecnie nieużywane** w żadnej trasie (zachowane do ewentualnego użycia).
