import type { Localized } from '@/lib/i18n';

export const nowItems: readonly {
  id: 'learning' | 'reading' | 'listening';
  label: Localized;
  value: Localized;
  href?: string;
}[] = [
  {
    id: 'learning',
    label: { en: 'Learning', sk: 'Učím sa' },
    value: {
      en: 'Backend development, mostly Node.js and Go',
      sk: 'Backendový vývoj, hlavne Node.js a Go',
    },
  },
  {
    id: 'reading',
    label: { en: 'Reading', sk: 'Čítam' },
    // The book is the English edition, so its title stays in English.
    value: {
      en: 'Seven and a Half Lessons About the Brain, Lisa Feldman Barrett',
      sk: 'Seven and a Half Lessons About the Brain, Lisa Feldman Barrett',
    },
    href: 'https://www.goodreads.com/book/show/50535801-seven-and-a-half-lessons-about-the-brain',
  },
  {
    id: 'listening',
    label: { en: 'Listening', sk: 'Počúvam' },
    value: { en: 'Portugal. The Man', sk: 'Portugal. The Man' },
  },
];

export const nowUpdated: Localized = { en: 'Nov 2026', sk: 'nov 2026' };

export const listening = { lastPlayed: { en: 'last played', sk: 'naposledy hrané' } } as const;

// focus keeps the subject in frame when mobile tiles crop a photo.
export const photos: readonly {
  src: string;
  alt: Localized;
  caption: Localized;
  focus: string;
}[] = [
  {
    src: '/assets/off-the-clock/basalt-canyon.jpg',
    alt: {
      en: 'A person standing on basalt columns beside a turquoise river in a narrow canyon',
      sk: 'Človek stojaci na čadičových stĺpoch pri tyrkysovej rieke v úzkom kaňone',
    },
    caption: { en: 'Stuðlagil, Iceland', sk: 'Stuðlagil, Island' },
    focus: '50% 75%',
  },
  {
    src: '/assets/off-the-clock/moss-canyon.jpg',
    alt: {
      en: 'Moss-covered canyon walls with a thin waterfall falling from a cliff',
      sk: 'Steny kaňonu porastené machom a tenký vodopád padajúci z útesu',
    },
    caption: { en: 'Múlagljúfur, Iceland', sk: 'Múlagljúfur, Island' },
    focus: '60% 50%',
  },
  {
    src: '/assets/off-the-clock/boardwalk-stairs.jpg',
    alt: {
      en: 'A person with a backpack walking down a long wooden staircase into a dry valley',
      sk: 'Človek s batohom schádzajúci po dlhom drevenom schodisku do suchého údolia',
    },
    caption: {
      en: 'Passadiços Barranco do Demo, Portugal',
      sk: 'Passadiços Barranco do Demo, Portugalsko',
    },
    focus: '50% 45%',
  },
];
