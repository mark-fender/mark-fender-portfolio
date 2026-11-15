export const site = {
  name: 'Marek Lipčák',
  initials: 'ML',
  url: 'https://www.markfender.dev/',
  role: 'Frontend Software Engineer',
  city: 'Košice',
  country: 'SK',
  timeZone: 'Europe/Bratislava',
  availability: { en: 'Available', sk: 'K dispozícii' },
  headline: {
    en: 'Making complex software feel simple.',
    sk: 'Tvorím zložitý softvér, ktorý sa jednoducho používa.',
  },
  intro: {
    en: "I'm Marek, a software engineer. I like working out how things are built and how to make them better, and I care about the small details that make software easy to use. Simple solutions usually win, even when they're hard to find.",
    sk: 'Som Marek, softvérový inžinier. Baví ma zisťovať, ako sú veci postavené a ako ich vylepšiť, a záleží mi na drobnostiach, vďaka ktorým sa softvér ľahko používa. Jednoduché riešenia zvyčajne vyhrávajú, aj keď je ťažké ich nájsť.',
  },
  // Page description and share card. Keep it to one sentence without numbers that go stale.
  description: {
    en: 'Frontend engineer from Košice. I build React and TypeScript frontends for complex web apps, and now work on ArkMap, a network discovery and topology platform.',
    sk: 'Frontendový inžinier z Košíc. Robím frontendy v Reacte a TypeScripte pre zložité webové aplikácie a teraz pracujem na ArkMap, platforme na objavovanie sietí a správu ich topológie.',
  },
  stack: ['React', 'TypeScript', 'MobX-State-Tree'],
  xpYears: 9,
} as const;

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marek-lip%C4%8D%C3%A1k/' },
  { label: 'GitHub', href: 'https://github.com/mark-fender' },
  { label: 'Instagram', href: 'https://www.instagram.com/marek_lipcak/' },
] as const;
