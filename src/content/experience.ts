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
      en: 'My first job, part time while I was still studying. I tested features with JUnit and Selenium, built internal tools and made the existing test suites more stable and faster to run.',
      sk: 'Moja prvá práca, na čiastočný úväzok popri štúdiu. Testoval som funkcie v JUnite a Seleniu, robil interné nástroje a existujúce testy som urobil stabilnejšími a rýchlejšími.',
    },
  },
  {
    company: 'Workflows',
    title: 'Frontend Software Engineer',
    from: { year: 2018, month: 9 },
    to: { year: 2022, month: 10 },
    description: {
      en: 'I joined as a junior and worked on Angular apps, mostly for the Austrian client NTS Retail. Over four years I went from working on existing projects to starting new ones from scratch, and I helped refactor and clean up a legacy codebase.',
      sk: 'Nastúpil som ako junior a pracoval na aplikáciách v Angulari, hlavne pre rakúskeho klienta NTS Retail. Za štyri roky som sa posunul od práce na existujúcich projektoch k zakladaniu nových od nuly a pomáhal som refaktorovať a upratať starý kód.',
    },
  },
  {
    company: 'GlobalLogic',
    title: 'Frontend Software Engineer',
    from: { year: 2022, month: 11 },
    to: { year: 2023, month: 4 },
    description: {
      en: 'I was the only frontend developer on Inveox SampleX, so the frontend architecture was my call. I built authentication, authorization and user management, and the WebSocket connection that keeps the interface up to date with the processing state.',
      sk: 'Na Inveox SampleX som bol jediný frontendový vývojár, takže architektúra frontendu bola na mne. Postavil som autentifikáciu, autorizáciu a správu používateľov a WebSocketové spojenie, ktoré drží rozhranie v súlade so stavom spracovania.',
    },
  },
  {
    company: 'Indra Avitech',
    title: 'Frontend Software Engineer',
    from: { year: 2023, month: 5 },
    to: { year: 2025, month: 7 },
    description: {
      en: 'I was on a team building frontends for aviation software, mainly an AIXM editor for digital NOTAMs. The aeronautical data models are large and deeply nested, and much of my work was keeping that data consistent between a form, a map and the final message.',
      sk: 'Bol som v tíme, ktorý robil frontendy pre letecký softvér, hlavne editor AIXM pre digitálne NOTAM. Letecké dátové modely sú veľké a hlboko vnorené a veľká časť mojej práce bola udržať tieto dáta konzistentné medzi formulárom, mapou a výslednou správou.',
    },
    points: [
      {
        en: 'Wrote the geometry conversion from the data models to GeoJSON behind a side-by-side map and form editor, where a change in one shows up in the other straight away.',
        sk: 'Napísal som prevod geometrie z dátových modelov do GeoJSON pre editor, kde sú mapa a formulár vedľa seba a zmena v jednom sa hneď prejaví v druhom.',
      },
      {
        en: 'Implemented encoding logic for NOTAM scenarios, which turns large nested data objects into short messages that follow the domain rules.',
        sk: 'Implementoval som kódovanie pre scenáre NOTAM, ktoré mení veľké vnorené dátové objekty na krátke správy podľa pravidiel domény.',
      },
      {
        en: 'Built forms that are generated from the data models instead of written by hand.',
        sk: 'Postavil som formuláre, ktoré sa generujú z dátových modelov namiesto písania ručne.',
      },
      {
        en: 'Improved the visual design and usability of the apps, raised test coverage and cleaned up code as I went.',
        sk: 'Zlepšil som vzhľad a použiteľnosť aplikácií, zvýšil pokrytie testami a priebežne upratoval kód.',
      },
    ],
  },
  {
    company: 'Hotovo for Caterpillar',
    title: 'Frontend Software Engineer, Cat AI Assistant',
    from: { year: 2025, month: 7 },
    to: { year: 2026, month: 3 },
    description: {
      en: "I joined Caterpillar's Cat AI Assistant team through the Hotovo agency. My part was the response experience: streaming, the reveal animation, text-to-speech and images from the model. Alongside the features I refactored existing code and took part in architecture discussions.",
      sk: 'Do tímu Cat AI Assistant v Caterpillari som sa dostal cez agentúru Hotovo. Mojou časťou bolo všetko okolo odpovedí: streamovanie, animácia zobrazovania, prevod textu na reč a obrázky z modelu. Popri funkciách som refaktoroval existujúci kód a zapájal sa do diskusií o architektúre.',
    },
  },
  {
    company: 'NetCore',
    title: 'Frontend Software Engineer, ArkMap',
    from: { year: 2026, month: 3 },
    to: null,
    description: {
      en: 'I work on ArkMap, a platform for network discovery and topology management. I build product screens in React and TypeScript, the shared code they run on, and the end-to-end tests that check them against a real backend.',
      sk: 'Pracujem na ArkMap, platforme na objavovanie sietí a správu ich topológie. Robím obrazovky produktu v Reacte a TypeScripte, spoločný kód, na ktorom bežia, a end-to-end testy, ktoré ich overujú proti skutočnému backendu.',
    },
    points: [
      {
        en: 'Reworked the jobs and tasks drawer so people can follow discovery as it runs: status, progress by state, live durations, and links between jobs, tasks and the devices they touch.',
        sk: 'Prerobil som panel jobov a úloh, aby ľudia mohli sledovať objavovanie siete, kým beží: stav, priebeh podľa stavov, živé trvanie a prepojenia medzi jobmi, úlohami a zariadeniami, ktorých sa týkajú.',
      },
      {
        en: 'Redesigned the topology dashboard on a lighter data model, with cache-first thumbnails, a queue that limits concurrent graph requests, and guards that drop results once they are stale.',
        sk: 'Prerobil som dashboard topológie na ľahší dátový model, s náhľadmi primárne z cache, frontou, ktorá obmedzuje súbežné požiadavky na grafy, a poistkami, ktoré zahodia zastarané výsledky.',
      },
      {
        en: 'Built filtering and entity selection that tables, lists and forms share: filter presets, controlled filters, typed reactive option loading, and multiselects for the UI library.',
        sk: 'Postavil som filtrovanie a výber entít, ktoré zdieľajú tabuľky, zoznamy aj formuláre: predvoľby filtrov, kontrolované filtre, typované reaktívne načítanie možností a multiselecty pre UI knižnicu.',
      },
      {
        en: "Built the E2E testing infrastructure on Playwright: parallel runs against a real local backend, reusable fixtures and coverage collection from the built bundles, all running in Docker in the CI/CD pipeline. It's what keeps the product stable from release to release.",
        sk: 'Postavil som infraštruktúru E2E testov v Playwrighte: paralelné behy proti skutočnému lokálnemu backendu, znovupoužiteľné fixtures a zber pokrytia zo zostavených balíkov, všetko v Dockeri v CI/CD pipeline. Vďaka tomu je produkt stabilný od vydania k vydaniu.',
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
