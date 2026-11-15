import Section from '@/components/section/Section';
import { sectionHeader } from '@/content/nav';
import { projects } from '@/content/projects';
import { ui } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import ProjectCard from './ProjectCard';
import ProjectDeck from './ProjectDeck';

const ProjectsSection = ({ locale }: { locale: Locale }) => (
  <Section id='projects' {...sectionHeader('projects', locale)}>
    <h2 className='mb-10 text-section'>{ui[locale].projects.heading}</h2>
    <ProjectDeck>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} locale={locale} />
      ))}
    </ProjectDeck>
  </Section>
);

export default ProjectsSection;
