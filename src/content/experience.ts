import type { Localized } from '@/lib/i18n';

export type YearMonth = { year: number; month: number }; // month 1-12

export type Role = {
  company: string;
  // Job titles stay in English in every language, as on the contracts and CV.
  title: string;
  from: YearMonth;
  to: YearMonth | null; // null: the current role
  description: Localized;
  points?: readonly Localized[];
  stack?: readonly string[];
};

export const roles: readonly Role[] = [
  {
    company: 'Software AG',
    title: 'Software Engineer',
    from: { year: 2017, month: 9 },
    to: { year: 2018, month: 9 },
    description: {
      en: 'I worked here part time while still at university, writing JUnit and Selenium tests, building internal tools and making the existing test suites faster and less flaky.',
      sk: 'Pracoval som tu na čiastočný úväzok popri vysokej škole. Písal som testy v JUnite a Seleniu, robil interné nástroje a existujúce testy som zrýchlil a znížil počet ich náhodných zlyhaní.',
    },
  },
  {
    company: 'Workflows',
    title: 'Frontend Software Engineer',
    from: { year: 2018, month: 9 },
    to: { year: 2022, month: 10 },
    description: {
      en: 'This was my first frontend job, and I stayed four years, mostly on Angular apps for the Austrian retailer NTS Retail. I started as a junior fixing things in existing projects and ended up setting up new ones from scratch, alongside refactoring and making a legacy codebase cleaner.',
      sk: 'Bola to moja prvá frontendová práca a zostal som tam štyri roky, väčšinou na aplikáciách v Angulari pre rakúsku maloobchodnú firmu NTS Retail. Začínal som ako junior opravovaním vecí v existujúcich projektoch a nakoniec som zakladal nové od nuly. Popri tom som refaktoroval a upratoval legacy kód.',
    },
  },
  {
    company: 'GlobalLogic',
    title: 'Frontend Software Engineer',
    from: { year: 2022, month: 11 },
    to: { year: 2023, month: 4 },
    description: {
      en: 'For six months I was the only frontend developer on Inveox SampleX. I set up the architecture, built login and user permissions, and connected the UI to the machine over WebSockets so it always shows the current processing state.',
      sk: 'Pol roka som bol jediný frontendový vývojár na Inveox SampleX. Navrhol som architektúru, postavil prihlasovanie a používateľské oprávnenia a cez WebSockety som rozhranie prepojil s prístrojom, takže vždy ukazuje aktuálny stav spracovania.',
    },
  },
  {
    company: 'Indra Avitech',
    title: 'Frontend Software Engineer',
    from: { year: 2023, month: 5 },
    to: { year: 2025, month: 7 },
    description: {
      en: 'I spent two years on aviation software, mostly the AIXM editor for digital NOTAMs. The data models are deeply nested, and most of my work was keeping one piece of data consistent across a form, a map and the final message.',
      sk: 'Dva roky som robil na leteckom softvéri, hlavne na editore AIXM pre digitálne NOTAM. Dátové modely sú hlboko vnorené a väčšina mojej práce bola o tom, aby tie isté dáta sedeli vo formulári, na mape aj vo výslednej správe.',
    },
    points: [
      {
        en: 'Wrote the geometry conversion to GeoJSON, so an edit on the map shows up in the form and the other way round.',
        sk: 'Napísal som prevod geometrie do GeoJSON, takže úprava na mape sa ukáže vo formulári a naopak.',
      },
      {
        en: 'Implemented the encoding that turns a large nested object into a short NOTAM that follows the format rules.',
        sk: 'Implementoval som kódovanie, ktoré z veľkého vnoreného objektu urobí krátky NOTAM podľa pravidiel formátu.',
      },
      {
        en: "Built forms that generate themselves from the data models, so a new model doesn't need a hand-written form.",
        sk: 'Postavil som formuláre, ktoré sa samy generujú z dátových modelov, takže nový model nepotrebuje ručne písaný formulár.',
      },
    ],
  },
  {
    company: 'Hotovo for Caterpillar',
    title: 'Frontend Software Engineer, Cat AI Assistant',
    from: { year: 2025, month: 7 },
    to: { year: 2026, month: 3 },
    description: {
      en: 'I joined the Cat AI Assistant team as a contractor and worked on how answers show up on screen. The rest of my time went into refactoring older code and architecture discussions as the product grew.',
      sk: 'Do tímu Cat AI Assistant som nastúpil ako kontraktor a pracoval som na tom, ako sa odpovede zobrazujú na obrazovke. Zvyšok času mi zabral refaktoring staršieho kódu a diskusie o architektúre, keď produkt rástol.',
    },
  },
  {
    company: 'NetCore',
    title: 'Frontend Software Engineer, ArkMap',
    from: { year: 2026, month: 3 },
    to: null,
    description: {
      en: 'I build product screens, the shared components under them, and the test setup that checks all of it against a real backend.',
      sk: 'Robím obrazovky produktu, spoločné komponenty pod nimi a testovacie prostredie, ktoré to celé overuje proti skutočnému backendu.',
    },
    points: [
      {
        en: "Rebuilt the jobs and tasks drawer so you can watch a discovery run live, with each task's state, how long it has been running and which devices it touched.",
        sk: 'Prerobil som panel jobov a úloh, takže objavovanie siete sa dá sledovať naživo. Pri každej úlohe vidno jej stav, ako dlho beží a ktorých zariadení sa týkala.',
      },
      {
        en: 'Made the topology dashboard faster. It now runs on a lighter data model with cached thumbnails, limits how many graph requests go out at once, and drops responses that come back after the user has moved on.',
        sk: 'Zrýchlil som dashboard topológie. Teraz beží na ľahšom dátovom modeli s náhľadmi z cache, obmedzuje počet súbežných požiadaviek na grafy a zahodí odpovede, ktoré prídu, až keď je používateľ už inde.',
      },
      {
        en: 'Wrote the filtering and selection layer that tables, lists and forms share, so a new screen gets saved filters and async option loading for free.',
        sk: 'Napísal som vrstvu na filtrovanie a výber, ktorú zdieľajú tabuľky, zoznamy aj formuláre, takže nová obrazovka dostane uložené filtre a asynchrónne načítanie možností zadarmo.',
      },
      {
        en: 'Set up end-to-end testing with Playwright from scratch. The tests run in parallel against a real backend in Docker in every pipeline, and coverage is measured on the production build.',
        sk: 'Od nuly som postavil end-to-end testy v Playwrighte. Bežia paralelne proti skutočnému backendu v Dockeri v každej pipeline a pokrytie sa meria na produkčnom builde.',
      },
    ],
    stack: [
      'React',
      'TypeScript',
      'MobX-State-Tree',
      'MobX',
      'Socket.IO',
      'Chakra UI',
      'React Hook Form',
      'Zod',
      'Playwright',
      'Vitest',
      'Testing Library',
      'Vite',
      'Docker',
      'GitLab CI',
    ],
  },
];
