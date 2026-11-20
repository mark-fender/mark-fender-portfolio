import type { Locale } from '@/lib/i18n';

// Keep labels short enough for the desktop header, which switches to a menu below 1000px.
export const sections = [
  { id: 'projects', label: { en: 'Projects', sk: 'Projekty' } },
  { id: 'experience', label: { en: 'Experience', sk: 'Prax' } },
  { id: 'skills', label: { en: 'Skills', sk: 'Zručnosti' } },
  { id: 'game', label: { en: 'Game', sk: 'Hra' } },
  { id: 'travel', label: { en: 'Travel', sk: 'Cesty' } },
  { id: 'off-the-clock', label: { en: 'Off the clock', sk: 'Mimo práce' } },
  { id: 'contact', label: { en: 'Contact', sk: 'Kontakt' } },
] as const;

export type SectionId = (typeof sections)[number]['id'];

const home = { en: 'Home', sk: 'Domov' } as const;

export const navLinks = (locale: Locale) => [
  { name: home[locale], hash: '#home' as const },
  ...sections.map((s) => ({ name: s.label[locale], hash: `#${s.id}` as const })),
];

export const spySections = [
  { id: 'home', nav: 'home' },
  ...sections.map(({ id }) => ({ id, nav: id })),
];

export const sectionHeader = (id: SectionId, locale: Locale) => {
  const index = sections.findIndex((s) => s.id === id);
  return { index: index + 1, label: sections[index]!.label[locale], total: sections.length };
};
