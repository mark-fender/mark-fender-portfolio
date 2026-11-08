import { FaAngular, FaCss3Alt, FaDocker, FaGitAlt, FaHtml5, FaJs, FaReact } from 'react-icons/fa';
import {
  SiFramer,
  SiJest,
  SiNextdotjs,
  SiReactquery,
  SiReactivex,
  SiRedux,
  SiSocketdotio,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiWebpack,
  SiZod,
} from 'react-icons/si';
import { GiBearFace } from 'react-icons/gi';
import { TbApi } from 'react-icons/tb';
import type { YearMonth } from '@/lib/time';

export const sections = [
  { id: 'about', label: 'About', nav: true },
  { id: 'skills', label: 'Skills', nav: true },
  { id: 'experience', label: 'Experience', nav: true },
  { id: 'projects', label: 'Projects', nav: true },
  { id: 'off-the-clock', label: '[Off the clock]', nav: false },
  { id: 'contact', label: 'Contact', nav: true },
] as const;

type NavSection = Extract<(typeof sections)[number], { nav: true }>;

export const navBarLinks = [
  { name: 'Home', hash: '#home' },
  ...sections
    .filter((s): s is NavSection => s.nav)
    .map((s) => ({ name: s.label, hash: `#${s.id}` as const })),
] as const;

export const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/marek-lipčák' },
  { label: 'Instagram', href: 'https://www.instagram.com/marek.lipcak/' },
  { label: 'GitHub', href: 'https://github.com/mark-fender' },
] as const;

export const siteMeta = {
  city: '[City]',
  country: 'SK',
  timeZone: 'Europe/Bratislava',
  currentRole: 'Front-End Developer @ Indra Avitech',
  availability: '[Availability status]',
} as const;

export const nowItems = [
  { label: 'Building', value: '[placeholder]' },
  { label: 'Learning', value: '[placeholder]' },
  { label: 'Reading', value: '[placeholder]' },
  { label: 'Listening', value: '[placeholder]' },
  { label: 'Last hike', value: '[placeholder]' },
] as const;

export const experiencesData: readonly {
  title: string;
  company: string;
  description: string;
  from: YearMonth;
  to: YearMonth | null;
}[] = [
  {
    title: 'Front-End Developer',
    company: 'Indra Avitech',
    description:
      'Part of a development team responsible for development and testing of frontend of applications used by employees in aviation sector where I greatly contributed to improving visual design and usability of developed products and increasing test coverage of the codebase. In this team we were solving challenges like dynamically generating forms based on complex data models, designing and implementing layouts with multiple content panels enabling users to effectively edit forms and maps at the same time and utilizing best coding practices and architecture design to transform large nested objects of data into shortend, easily readable messages encoded according to domain rules also known as digital NOTAMs.',
    from: { year: 2023, month: 5 },
    to: null,
  },
  {
    title: 'Front-End Developer',
    company: 'Global Logic',
    description:
      'Lead the development of user interface for controlling sample registration module that processes samples of patients tissue in medical environment. As a single frontend developer I was responsible for designing architecture, implementing authentication, authorization and user management and using WebSockets to provide real time updates on processing state.',
    from: { year: 2022, month: 11 },
    to: { year: 2023, month: 4 },
  },
  {
    title: 'Front-End Developer',
    company: 'Workflows',
    description:
      'Part of a development team responsible for development, testing and maintenance of frontend projects, mostly for Austrian client NTS Retail. In this position I started out as a junior developer and after acquiring lots of experience I was able to built several projects from scratch and helped to refactor and improve code quality in legacy codebase.',
    from: { year: 2018, month: 9 },
    to: { year: 2022, month: 10 },
  },
  {
    title: 'Software Engineer',
    company: 'Software AG',
    description:
      'Part time position I started as a student where my main tasks included testing software features using JUnit and Selenium and development of internal tools. Managed to optimize stability and execution times of existing test suites.',
    from: { year: 2017, month: 9 },
    to: { year: 2018, month: 9 },
  },
];

type Project = {
  title: string;
  description: string;
  tags: readonly string[];
  url?: string; // drives the "Live preview ↗" button
};

export const projectsData: readonly Project[] = [
  {
    title: 'Cat AI Assistant',
    description:
      'Cat AI Assistant is Caterpillar’s customer-facing AI assistant. Equipment owners, fleet managers and technicians ask questions in plain language and get answers drawn from manuals, service docs, parts catalogs and their own fleet data, instead of digging through half a dozen separate tools. It ships as a micro-frontend that other Caterpillar apps embed and as a standalone app at cat.ai. As a frontend developer on the team, I built the core of the response experience. That included LLM response streaming and the reveal animations that make answers read smoothly as they arrive, text-to-speech playback of responses, and rendering of images returned by the model. Alongside feature work, I refactored existing code and contributed to architecture discussions.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'TanStack Query'],
  },
  {
    title: 'AIXM Editor & Digital NOTAM management',
    description:
      'Applications used in aviation sector to encode messages containing operationally relevant updates exchanged between systems according to specific set of rules also known as digital NOTAMs. Digital NOTAM data can be used to provide information on temporary changes affecting flight operations such as work in progress areas, closed taxiways/runways, new obstacles such as cranes and more. Also displaying these changes on the map and editing them either via forms or real time map editing.',
    tags: [
      'ReactJS',
      'TypeScript',
      'SCSS',
      'Ant Design',
      'Jest',
      'Tanstack Query',
      'React Hook Form',
      'Zod',
      'Jenkins',
      'BitBucket',
      'REST API',
    ],
  },
  {
    title: 'Inveox SampleX',
    description:
      "User interface for a machine intended to be used in hospitals with built in user authentication with PIN code and admin user management. Provides functionality to manage and monitor the processing containers housing patients' tissue samples being analysed for detecting cancer cells.",
    tags: [
      'ReactJS',
      'TypeScript',
      'Emotion',
      'React Hook Form',
      'Redux',
      'Jest',
      'GitHub',
      'WebSocket',
      'REST API',
      'Docker',
    ],
  },
  {
    title: 'NTS Retail POS & Welcome Manager',
    description:
      "Applications enabling the retail staff to manage cash flow of the store, adding products to cart and processing payments, calculating daily turnover and employee shift management for supervisors. Also managing the queues of incoming customers, assigning consultants for them and sending automatic notifications, alerting customers when it's their turn in line.",
    tags: [
      'Angular',
      'TypeScript',
      'SCSS',
      'RxJS',
      'NgRx',
      'Jenkins',
      'Gitlab',
      'WebSocket',
      'REST API',
      'Docker',
    ],
  },
];

export const skillsData = [
  { name: 'HTML5', icon: FaHtml5 },
  { name: 'CSS3', icon: FaCss3Alt },
  { name: 'JavaScript', icon: FaJs },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'ReactJS', icon: FaReact },
  { name: 'NextJS', icon: SiNextdotjs },
  { name: 'Angular', icon: FaAngular },
  { name: 'Jest', icon: SiJest },
  { name: 'Zod', icon: SiZod },
  { name: 'Tanstack Query', icon: SiReactquery },
  { name: 'Redux', icon: SiRedux },
  { name: 'Zustand', icon: GiBearFace },
  { name: 'Git', icon: FaGitAlt },
  { name: 'Tailwind', icon: SiTailwindcss },
  { name: 'Styled Components', icon: SiStyledcomponents },
  { name: 'Framer Motion', icon: SiFramer },
  { name: 'RxJs', icon: SiReactivex },
  { name: 'REST', icon: TbApi },
  { name: 'WebSocket', icon: SiSocketdotio },
  { name: 'Vite', icon: SiVite },
  { name: 'Webpack', icon: SiWebpack },
  { name: 'Docker', icon: FaDocker },
] as const;

type SkillName = (typeof skillsData)[number]['name'];
// Keeps the icons in one place; SkillName makes a misspelt name a type error.
const pick = (...names: SkillName[]) =>
  names.map((name) => skillsData.find((skill) => skill.name === name)!);

export const skillGroups = [
  { name: 'Languages', items: pick('HTML5', 'CSS3', 'JavaScript', 'TypeScript') },
  { name: 'Frameworks', items: pick('ReactJS', 'NextJS', 'Angular') },
  { name: 'Styling & motion', items: pick('Tailwind', 'Styled Components', 'Framer Motion') },
  {
    name: 'State & data',
    wide: true,
    items: pick('Redux', 'Zustand', 'Tanstack Query', 'RxJs', 'Zod', 'REST', 'WebSocket'),
  },
  { name: 'Tooling & testing', items: pick('Jest', 'Git', 'Vite', 'Webpack', 'Docker') },
];
