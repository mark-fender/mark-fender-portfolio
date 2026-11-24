import type { ComponentType } from 'react';
import { sections, type SectionId } from '@/content/nav';
import { Contact } from '@/features/contact';
import { ExperienceSection } from '@/features/experience';
import { Hero } from '@/features/hero';
import { OffTheClock } from '@/features/off-the-clock';
import { ProjectsSection } from '@/features/projects';
import { SkillsSection } from '@/features/skills';
import { TravelSection } from '@/features/travel';
import { UntangleSection } from '@/features/untangle';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';

// Tenure and the footer year are computed on the server; rebuild daily so they stay current.
export const revalidate = 86400;

const sectionComponents: Record<SectionId, ComponentType<{ locale: Locale }>> = {
  projects: ProjectsSection,
  experience: ExperienceSection,
  skills: SkillsSection,
  game: UntangleSection,
  travel: TravelSection,
  'off-the-clock': OffTheClock,
  contact: Contact,
};

const Home = async ({ params }: PageProps<'/[lang]'>) => {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  return (
    <main id='main' tabIndex={-1} className='flex flex-col overflow-x-clip'>
      <Hero locale={locale} />
      {sections.map(({ id }) => {
        const Component = sectionComponents[id];
        return <Component key={id} locale={locale} />;
      })}
    </main>
  );
};

export default Home;
