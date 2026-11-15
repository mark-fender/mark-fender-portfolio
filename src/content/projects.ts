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
      en: 'ArkMap finds the devices on a network and maps how they connect. I work on its React frontend: monitoring for discovery jobs and tasks, device management, topology dashboards and wireless connection views. The data changes in real time, so keeping state consistent and the screens fast is a big part of the job.',
      sk: 'ArkMap nájde zariadenia v sieti a zmapuje, ako sú prepojené. Pracujem na jeho frontende v Reacte: monitorovanie úloh a jobov objavovania siete, správa zariadení, dashboardy topológie a prehľady bezdrôtových pripojení. Dáta sa menia v reálnom čase, takže veľká časť práce je udržať stav konzistentný a obrazovky rýchle.',
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
      en: "Caterpillar's AI assistant for equipment owners, fleet managers and technicians. It answers their questions from manuals, service docs, parts catalogs and their own fleet data. I built the response side: streaming LLM answers with a reveal animation, text-to-speech playback and images returned by the model. You can try a preview on cat.com.",
      sk: 'AI asistent od Caterpillaru pre majiteľov strojov, správcov vozových parkov a technikov. Odpovedá na ich otázky z návodov, servisnej dokumentácie, katalógov dielov a dát z ich vlastnej flotily. Postavil som časť s odpoveďami: streamovanie odpovedí LLM s animáciou zobrazovania, prehrávanie textu ako reči a obrázky, ktoré vracia model. Ukážku si môžete vyskúšať na cat.com.',
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
      en: 'Aviation software for digital NOTAMs, the notices about temporary changes like a closed runway or a new crane. I worked on forms generated from complex data models, on turning large nested data into short NOTAM messages that follow the domain rules, and on layouts for editing a form and a map side by side.',
      sk: 'Letecký softvér pre digitálne NOTAM, hlásenia o dočasných zmenách, napríklad o uzavretej dráhe alebo novom žeriave. Pracoval som na formulároch generovaných zo zložitých dátových modelov, na prevode veľkých vnorených dát na krátke správy NOTAM podľa pravidiel domény a na rozloženiach, kde sa formulár a mapa upravujú vedľa seba.',
    },
    tags: ['React', 'TypeScript', 'Ant Design', 'React Hook Form', 'Zod'],
  },
  {
    slug: 'inveox-samplex',
    title: 'Inveox SampleX',
    domain: { en: 'Medical devices', sk: 'Zdravotnícke zariadenia' },
    client: 'Inveox',
    summary: {
      en: 'The interface of a hospital machine that processes tissue samples for cancer diagnostics. I was the only frontend developer, so I designed the architecture and built PIN login, user management and live status updates over WebSockets.',
      sk: 'Rozhranie nemocničného prístroja, ktorý spracúva vzorky tkaniva na diagnostiku rakoviny. Bol som jediný frontendový vývojár, takže som navrhol architektúru a postavil prihlasovanie PIN kódom, správu používateľov a živé aktualizácie stavu cez WebSockety.',
    },
    tags: ['React', 'TypeScript', 'Redux', 'WebSocket', 'Docker'],
  },
  {
    slug: 'nts-retail-pos',
    title: 'NTS Retail POS & Welcome Manager',
    domain: { en: 'Retail', sk: 'Maloobchod' },
    client: 'NTS Retail',
    summary: {
      en: "Point-of-sale apps for store staff: cart and payments, daily turnover and shift management. Welcome Manager handles the customer queue, assigns consultants and notifies customers when it's their turn. I worked on both in Angular.",
      sk: 'Pokladničné aplikácie pre personál predajní: košík a platby, denné tržby a správa zmien. Welcome Manager riadi rad zákazníkov, prideľuje konzultantov a dá zákazníkom vedieť, keď prídu na rad. Na oboch som pracoval v Angulari.',
    },
    tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'WebSocket'],
  },
];
