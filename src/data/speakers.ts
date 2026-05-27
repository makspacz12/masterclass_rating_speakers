export interface Speaker {
  /** unikalny identyfikator (klucze listy / routing) */
  id: string
  /** imię i nazwisko prelegenta */
  name: string
  /** tytuł wystąpienia */
  talkTitle: string
  /** biografia (akapity rozdzielane znakiem nowej linii) */
  bio: string
  /** ścieżka do zdjęcia w public/, np. '/prelegenci/piotr-moncarz.jpg' */
  photo: string
  /**
   * Punkt ostrości kadru (CSS `object-position`) — przy `object-cover` decyduje,
   * który fragment zdjęcia zostaje widoczny. Ustawiony na twarz danej osoby, bo
   * portrety mają różne proporcje i samo „object-top" ucinało twarze.
   */
  focus?: string
}

/**
 * Lista prelegentów. Zdjęcia wrzucaj do  public/prelegenci/
 * i podawaj ścieżkę jako '/prelegenci/<plik>'.
 */
export const speakers: Speaker[] = [
  {
    id: 'piotr-moncarz',
    name: 'Piotr Moncarz',
    talkTitle: 'Polska nie istnieje na arenie świata.',
    photo: '/prelegenci/piotr-moncarz.jpg',
    focus: '50% 30%',
    bio: `Piotr D. Moncarz, Ph.D., P.E., F. ASCE, NAE, inżynier, naukowiec, przedsiębiorca, notoryczny budowniczy mostu Innowacyjna Polska – Innowacyjne Stany Zjednoczone, a w tym przede wszystkim Dolina Krzemowa. Wieloletni Consulting i Adjunct Profesor Uniwersytetu Stanforda, wieloletni członek zespołu naukowo-badawczego firmy / think-tanku Exponent, w której przeszedł przez wszystkie szczeble korporacyjne i naukowe, kończąc z najwyższym tytułem Senior Fellow. Współzałożyciel, wieloletni prezes i CEO, obecnie wiceprzewodniczący firmy wydobycia ciepła geotermalnego XGS Energy.
Wybrany do amerykańskiej National Academy of Engineering. Współzałożyciel i przez ponad 20 lat przewodniczący US-Polish Trade Council. Współtwórca programu Top 500 Innovators. Założyciel, Prezes i CEO Poland in Silicon Valley Center for Science, Innovation, and Entrepreneurship.`,
  },
  {
    id: 'sylwia-czubkowska',
    name: 'Sylwia Czubkowska',
    talkTitle:
      'Jak wielkie firmy przejmują władzę nad światem. Śledztwo potwierdza: Elon Musk i big techy rządzą Polską.',
    photo: '/prelegenci/sylwia-czubkowska.jpg',
    focus: '50% 22%',
    bio: `Dziennikarka i ekspertka nowych technologii. Przez lata związana z czołowymi tytułami gospodarczo-technologicznymi — „Przekrojem", „Dziennikiem Gazetą Prawną" i „Gazetą Wyborczą"; była redaktorką naczelną magazynu Spider's Web+. Współtworzy popularny podcast „Techstorie" w TOK FM.
Autorka książek „Chińczycy trzymają nas mocno" oraz „Bóg techy. Jak wielkie firmy technologiczne przejmują władzę nad Polską i światem" (2025) — reportażu śledczego o cichej ekspansji globalnych korporacji technologicznych i ich realnym wpływie na suwerenność państw. Wielokrotnie nagradzana i nominowana, m.in. do Grand Press.`,
  },
  {
    id: 'krzysztof-gorski',
    name: 'Krzysztof M. Górski',
    talkTitle:
      'Jak być liderem przyszłości, który tworzy rzeczy, które dziś wydają się niemożliwe?',
    photo: '/prelegenci/krzysztof-gorski.jpg',
    focus: '50% 26%',
    bio: `Astrofizyk i kosmolog, Sekretarz Generalny Akademii Kopernikańskiej. Studia astronomiczne ukończył na Uniwersytecie Mikołaja Kopernika w Toruniu, a doktorat z fizyki uzyskał na Uniwersytecie Warszawskim. Prowadził badania m.in. na UC Berkeley, w Los Alamos, w Princeton, w Institute for Advanced Study, na Uniwersytecie w Chicago, w CNRS w Paryżu oraz w Goddard Space Flight Center. Od 2003 roku pracuje w Jet Propulsion Laboratory (NASA).
Twórca metody HEALPix — narzędzia do konstrukcji, wizualizacji i analizy map sygnału astronomicznego na całej sferze niebieskiej, wykorzystywanej w misjach takich jak WMAP, Planck, Fermi LAT i Gaia. Laureat prestiżowej Nagrody Grubera w dziedzinie kosmologii, uhonorowany tytułem „Futurysty Roku 2024".`,
  },
  {
    id: 'jerzy-bralczyk',
    name: 'Jerzy Bralczyk',
    talkTitle: 'Zaczynaj od pytań: Czy, Co, Po co, Jak?',
    photo: '/prelegenci/jerzy-bralczyk.jpg',
    focus: '50% 30%',
    bio: `Profesor nauk humanistycznych, językoznawca specjalizujący się w języku mediów, reklamy i polityki. Urodzony w 1947 roku w Ciechanowie, absolwent polonistyki Uniwersytetu Warszawskiego, gdzie wykłada w Instytucie Dziennikarstwa. Wieloletni członek Rady Języka Polskiego, w której zasiada również w prezydium jako wiceprzewodniczący.
Jeden z najbardziej rozpoznawalnych popularyzatorów wiedzy o polszczyźnie — współtwórca i gospodarz programów telewizyjnych oraz radiowych, m.in. „Mówi się", „Na słówko" i „Słowo o słowie". Autor wielu książek o języku i kulturze słowa.`,
  },
  {
    id: 'jaroslaw-krolewski',
    name: 'Jarosław Królewski',
    talkTitle:
      'Jeśli ludzkość nie będzie w stanie ujarzmić AI, to zasługuje na zniknięcie z tego świata.',
    photo: '/prelegenci/jaroslaw-krolewski.jpg',
    focus: '50% 28%',
    bio: `Przedsiębiorca, programista, socjolog i inwestor. Współzałożyciel i prezes Synerise — spółki tworzącej oparte na sztucznej inteligencji i big data oprogramowanie dla biznesu, jednej z najszybciej rosnących firm technologicznych w Polsce. Naukowiec i wykładowca Akademii Górniczo-Hutniczej w Krakowie.
Prezes i większościowy właściciel Wisły Kraków — w 2019 roku zainicjował akcję ratunkową klubu oraz pionierską w polskim sporcie emisję akcji w formule crowdfundingu. Wybrany Młodym Liderem Globalnym (Young Global Leader) Światowego Forum Ekonomicznego, powołany do Rady ds. Przyszłości przy Prezesie Rady Ministrów.`,
  },
]
