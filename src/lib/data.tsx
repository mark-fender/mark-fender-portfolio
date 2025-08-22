import {
  FaAngular,
  FaCss3Alt,
  FaDocker,
  FaGitAlt,
  FaHtml5,
  FaJs,
  FaReact,
} from 'react-icons/fa';
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
import { RiEmotionLine } from 'react-icons/ri';
import { TbApi } from 'react-icons/tb';

export const navBarLinks = [
  {
    name: 'Home',
    hash: '#home',
  },
  {
    name: 'About',
    hash: '#about',
  },
  {
    name: 'Skills',
    hash: '#skills',
  },
  {
    name: 'Experience',
    hash: '#experience',
  },
  {
    name: 'Projects',
    hash: '#projects',
  },
  {
    name: 'Contact',
    hash: '#contact',
  },
] as const;

export const experiencesData = [
  {
    title: 'Front-End Developer',
    company: 'Indra Avitech',
    description:
      'Part of a development team responsible for development and testing of frontend of applications used by employees in aviation sector where I greatly contributed to improving visual design and usability of developed products and increasing test coverage of the codebase. In this team we were solving challenges like dynamically generating forms based on complex data models, designing and implementing layouts with multiple content panels enabling users to effectively edit forms and maps at the same time and utilizing best coding practices and architecture design to transform large nested objects of data into shortend, easily readable messages encoded according to domain rules also known as digital NOTAMs.',
    date: 'May 2023 - present',
  },
  {
    title: 'Front-End Developer',
    company: ' Global Logic',
    description:
      'Lead the development of user interface for controlling sample registration module that processes samples of patients tissue in medical environment. As a single frontend developer I was responsible for designing architecture, implementing authentication, authorization and user management and using WebSockets to provide real time updates on processing state.',
    date: 'November 2022 - April 2023',
  },
  {
    title: 'Front-End Developer',
    company: 'Workflows',
    description:
      'Part of a development team responsible for development, testing and maintenance of frontend projects, mostly for Austrian client NTS Retail. In this position I started out as a junior developer and after acquiring lots of experience I was able to built several projects from scratch and helped to refactor and improve code quality in legacy codebase.',
    date: 'September 2018 - October 2022',
  },
  {
    title: 'Software Engineer',
    company: 'Software AG',
    description:
      'Part time position I started as a student where my main tasks included testing software features using JUnit and Selenium and development of internal tools. Managed to optimize stability and execution times of existing test suites.',
    date: 'September 2017 - September 2018',
  },
] as const;

export const projectsData = [
  {
    title: 'Imaginify',
    description: (
      <>
        An online SaaS platform enabling users to edit photos using AI. It is possible to restore
        images in poor quality, generative fill image surroundings, remove or recolor objects or
        remove image background. Each edit costs one credit and credits can be purchased via Stripe
        payment gateway. Each user can view their edited images in their profile and all of the
        edits in homepage. Used for learning and based on design and resources provided by{' '}
        <a
          style={{ textDecoration: 'underline' }}
          href='https://www.jsmastery.pro/'
          target='_blank'>
          Javascript Mastery
        </a>
        . Live preview available{' '}
        <a
          style={{ textDecoration: 'underline' }}
          href='https://imaginify-amber-omega.vercel.app/'
          target='_blank'>
          here
        </a>
        .
      </>
    ),
    tags: [
      'ReactJS',
      'NextJS',
      'TypeScript',
      'Tailwind',
      'Shadcn UI',
      'React Hook Form',
      'Zod',
      'Cloudinary AI',
      'Clerk Auth',
      'Stripe',
      'MongoDB',
    ],
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
] as const;

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
  { name: 'Emotion', icon: RiEmotionLine },
  { name: 'Styled Components', icon: SiStyledcomponents },
  { name: 'Framer Motion', icon: SiFramer },
  { name: 'RxJs', icon: SiReactivex },
  { name: 'REST API', icon: TbApi },
  { name: 'WebSocket', icon: SiSocketdotio },
  { name: 'Vite', icon: SiVite },
  { name: 'Webpack', icon: SiWebpack },
  { name: 'Docker', icon: FaDocker },
] as const;
