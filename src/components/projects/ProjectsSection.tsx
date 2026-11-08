import ProjectDeck from '@/components/projects/ProjectDeck';
import SectionRule from '@/components/SectionRule';
import { projectsData } from '@/lib/data';

const ProjectsSection = () => (
  <section id='projects' className='page-container pt-18 pb-0 min-[920px]:pt-10 min-[920px]:pb-34'>
    <div className='mb-3.5 min-[920px]:mb-6'>
      <SectionRule id='projects' />
    </div>
    <div className='mb-3.5 flex flex-wrap items-end justify-between gap-6 min-[920px]:mb-12'>
      <h2 className='text-section'>My projects</h2>
      <span className='font-mono text-label text-muted-foreground max-[920px]:hidden'>
        Scroll to shuffle the deck ↓
      </span>
    </div>
    <ProjectDeck projects={projectsData} />
  </section>
);

export default ProjectsSection;
