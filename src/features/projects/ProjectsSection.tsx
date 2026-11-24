import RevealHeading from '@/components/motion/RevealHeading';
import Section from '@/components/section/Section';
import { projects } from '@/content/projects';
import { ui } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import ProjectCard from './ProjectCard';
import ProjectDeck from './ProjectDeck';

const ProjectsSection = ({ locale }: { locale: Locale }) => (
  <Section id='projects'>
    <RevealHeading className='mb-10 text-section' text={ui[locale].projects.heading} />
    <ProjectDeck>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} locale={locale} />
      ))}
    </ProjectDeck>
  </Section>
);

export default ProjectsSection;
