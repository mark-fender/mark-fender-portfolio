'use client';

import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/projects/ProjectCard';
import { projectsData } from '@/lib/data';
import useProjectList from './hooks/useProjectList';

const ProjectList = () => {
  const { sectionRef, projectsRef, scrollYProgress } = useProjectList();

  return (
    <section ref={sectionRef} id='projects' className='scroll-mt-36 mb-16'>
      <div ref={projectsRef}>
        <SectionHeading>My Projects</SectionHeading>
        {projectsData.map((project, index) => {
          const targetScale = 1 - (projectsData.length - index) * 0.05;
          return (
            <ProjectCard
              key={project.title}
              index={index}
              {...project}
              range={[index * 0.25, 1]}
              targetScale={targetScale}
              progress={scrollYProgress}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ProjectList;
