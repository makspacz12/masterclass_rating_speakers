/**
 * Baza wartości fundacji CTN (Centrum Twórczości Narodowej).
 * Wykorzystywana w stopce strony oceny, aby motyw spójnie nawiązywał do fundacji.
 * Źródło: ctn.org.pl/o-fundacji
 */
export const foundation = {
  name: 'Fundacja Centrum Twórczości Narodowej',
  short: 'CTN',
  since: 2002,
  motto: 'Otwieramy okna tam, gdzie zamknięte są drzwi.',
  mission:
    'Pomagamy ludziom osiągać wielkość, do której zostali stworzeni.',
  values: [
    {
      title: 'Twórczość',
      desc: 'Promujemy twórczy styl życia — przez kreatywność otwieramy się na innych.',
    },
    {
      title: 'Wielkość',
      desc: 'Wspieramy ludzi w sięganiu po potencjał, do którego zostali stworzeni.',
    },
    {
      title: 'Dialog pokoleń',
      desc: 'Łączymy doświadczonych liderów z młodymi talentami.',
    },
    {
      title: 'Wartości',
      desc: 'Działamy w oparciu o kulturę i pomoc społeczną.',
    },
  ],
} as const
