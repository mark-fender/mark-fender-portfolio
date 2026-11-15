import type { Localized } from '@/lib/i18n';

export const skillGroups = [
  {
    id: 'languages',
    name: { en: 'Languages', sk: 'Jazyky' },
    items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'frameworks',
    name: { en: 'Frameworks', sk: 'Frameworky' },
    items: ['React', 'Next.js', 'Angular'],
  },
  {
    id: 'state',
    name: { en: 'State & data', sk: 'Stav a dáta' },
    items: [
      'MobX-State-Tree',
      'TanStack Query',
      'Zustand',
      'Redux',
      'RxJS',
      'React Hook Form',
      'Zod',
      'REST',
      'WebSocket',
    ],
  },
  {
    id: 'styling',
    name: { en: 'Styling & motion', sk: 'Štýly a animácie' },
    items: ['Tailwind CSS', 'Chakra UI', 'Styled Components', 'Framer Motion'],
  },
  {
    id: 'tooling',
    name: { en: 'Tooling & testing', sk: 'Nástroje a testy' },
    items: ['Playwright', 'Vitest', 'Jest', 'Vite', 'Webpack', 'Git', 'Docker', 'GitLab CI'],
  },
] as const satisfies readonly { id: string; name: Localized; items: readonly string[] }[];

export type SkillGroupId = (typeof skillGroups)[number]['id'];
export type SkillName = (typeof skillGroups)[number]['items'][number];
