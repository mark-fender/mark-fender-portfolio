import type { Locale } from '@/lib/i18n';

// Page order. `nav: false` keeps a section out of the header, which is sized for seven links:
// keep the labels short in every language, or the header no longer fits on one line.
export const sections = [
  { id: 'projects', label: { en: 'Projects', sk: 'Projekty' }, nav: true },
  { id: 'experience', label: { en: 'Experience', sk: 'Prax' }, nav: true },
  { id: 'skills', label: { en: 'Skills', sk: 'Zručnosti' }, nav: true },
  { id: 'game', label: { en: 'Game', sk: 'Hra' }, nav: true },
  { id: 'travel', label: { en: 'Travel', sk: 'Cesty' }, nav: true },
  { id: 'off-the-clock', label: { en: 'Off the clock', sk: 'Mimo práce' }, nav: false },
  { id: 'contact', label: { en: 'Contact', sk: 'Kontakt' }, nav: true },
] as const;

export type SectionId = (typeof sections)[number]['id'];
type NavSection = Extract<(typeof sections)[number], { nav: true }>;

const home = { en: 'Home', sk: 'Domov' } as const;

export const navLinks = (locale: Locale) => [
  { name: home[locale], hash: '#home' as const },
  ...sections
    .filter((s): s is NavSection => s.nav)
    .map((s) => ({ name: s.label[locale], hash: `#${s.id}` as const })),
];

// Scroll-spy targets: every section, each mapped to the nav item to highlight. A section that
// isn't in the nav highlights the nav section before it (off-the-clock → travel).
export const spySections = [
  { id: 'home', nav: 'home' },
  ...sections.map((s, i) => ({
    id: s.id,
    nav: [...sections.slice(0, i + 1)].reverse().find((p) => p.nav)?.id ?? 'home',
  })),
];

export const sectionHeader = (id: SectionId, locale: Locale) => {
  const index = sections.findIndex((s) => s.id === id);
  return { index: index + 1, label: sections[index]!.label[locale], total: sections.length };
};
