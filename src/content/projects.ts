import type { Localized } from '@/lib/i18n';

export type Project = {
  slug: string;
  title: string;
  domain: Localized;
  client?: string;
  summary: Localized;
  tags: readonly string[];
  // The project I work on now: olive label. List it first so it tops the deck.
  featured?: true;
  // Turns the first `label` in the summary into a link to `href`. Every language's summary
  // must contain the label.
  link?: { label: string; href: string };
};

export const projects: readonly Project[] = [
  {
    slug: 'arkmap',
    title: 'ArkMap',
    domain: { en: 'Networking', sk: 'Siete' },
    client: 'NetCore',
    summary: {
      en: 'ArkMap scans a network, finds the devices on it and maps how they connect. I work on the React frontend. Discovery jobs report progress while you watch and new devices turn up mid-scan, so the topology view has to keep up without freezing or showing stale data.',
      sk: 'ArkMap preskenuje sieť, nájde v nej zariadenia a zmapuje, ako sú prepojené. Pracujem na jeho frontende v Reacte. Priebeh skenovania vidno naživo a nové zariadenia pribúdajú ešte počas neho, takže mapa topológie musí držať krok bez toho, aby zamŕzala alebo ukazovala staré dáta.',
    },
    tags: ['React', 'TypeScript', 'MobX-State-Tree', 'Socket.IO', 'Chakra UI', 'Playwright'],
    featured: true,
  },
  {
    slug: 'cat-ai-assistant',
    title: 'Cat AI Assistant',
    domain: { en: 'Enterprise AI', sk: 'Firemná AI' },
    client: 'Caterpillar',
    summary: {
      en: "Caterpillar's assistant lets equipment owners and technicians ask a question instead of digging through manuals and parts catalogs. I built what happens after you hit send. The answer streams in as the model writes it, can be read aloud and can include images. There's a public preview on cat.com.",
      sk: 'Majitelia strojov a technici sa môžu asistenta od Caterpillaru opýtať namiesto toho, aby sa prehrabávali v návodoch a katalógoch dielov. Postavil som všetko, čo sa deje po odoslaní otázky. Odpoveď pribúda tak, ako ju model píše, dá sa prečítať nahlas a môže obsahovať obrázky. Verejnú ukážku nájdete na cat.com.',
    },
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'TanStack Query'],
    link: { label: 'cat.com', href: 'https://www.cat.com' },
  },
  {
    slug: 'aixm-editor',
    title: 'AIXM Editor & Digital NOTAM',
    domain: { en: 'Aviation', sk: 'Letectvo' },
    client: 'Indra Avitech',
    summary: {
      en: "A NOTAM is the notice pilots get when something changes at an airfield, like a closed runway or a crane near the approach, and this editor is where they're made. The aviation data behind each one is huge. I worked on forms that are generated from the data models and on squeezing the result into a few lines a pilot can read.",
      sk: 'NOTAM je hlásenie, ktoré pilot dostane, keď sa na letisku niečo zmení, napríklad je zavretá dráha alebo pri priblížení stojí žeriav. V tomto editore tieto hlásenia vznikajú. Za každým stojí obrovské množstvo leteckých dát. Pracoval som na formulároch, ktoré sa generujú z dátových modelov, a na tom, aby sa výsledok zmestil do pár riadkov, ktoré pilot zvládne prečítať.',
    },
    tags: ['React', 'TypeScript', 'Ant Design', 'React Hook Form', 'Zod'],
  },
  {
    slug: 'inveox-samplex',
    title: 'Inveox SampleX',
    domain: { en: 'Medical devices', sk: 'Zdravotnícke zariadenia' },
    client: 'Inveox',
    summary: {
      en: "SampleX is a lab machine that prepares tissue samples for cancer diagnostics, and I built its touchscreen interface. I was the only frontend developer, so I designed the architecture too. Staff sign in with a PIN, and the screen follows the machine's state as it runs.",
      sk: 'SampleX je laboratórny prístroj, ktorý pripravuje vzorky tkaniva na diagnostiku rakoviny. Postavil som jeho dotykové rozhranie. Bol som jediný frontendový vývojár, takže som navrhol aj architektúru. Personál sa prihlasuje PIN kódom a obrazovka priebežne ukazuje, v akom stave prístroj práve je.',
    },
    tags: ['React', 'TypeScript', 'Redux', 'WebSocket', 'Docker'],
  },
  {
    slug: 'nts-retail-pos',
    title: 'NTS Retail POS & Welcome Manager',
    domain: { en: 'Retail', sk: 'Maloobchod' },
    client: 'NTS Retail',
    summary: {
      en: "These are two Angular apps for store staff, and I worked on both. The POS handles checkout, payments, shifts and end-of-day totals. Welcome Manager runs the queue at the door. It assigns a consultant to each customer and tells them when it's their turn.",
      sk: 'Pre personál predajní som v Angulari pracoval na dvoch aplikáciách. Pokladničný systém pokrýva predaj, platby, zmeny a dennú uzávierku. Welcome Manager spravuje poradovník pri vstupe, zákazníkovi pridelí konzultanta a dá mu vedieť, keď je na rade.',
    },
    tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'WebSocket'],
  },
];
