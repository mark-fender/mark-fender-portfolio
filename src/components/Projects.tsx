'use client';

import SectionHeading from '@/components/SectionHeading';
import Project from '@/components/Project';
import { projectsData } from '@/lib/data';
import useSectionInView from '@/hooks/useSectionInView';
import { useRef } from 'react';
import { useScroll } from 'framer-motion';

const Projects = () => {
  const { ref } = useSectionInView({ sectionName: 'Projects', threshold: 0.2 });
  const projectsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: projectsRef,
    offset: ['start end', 'end end'],
  });

  return (
    <section ref={ref} id='projects' className='scroll-mt-36 mb-16'>
      <div ref={projectsRef}>
        <SectionHeading>My Projects</SectionHeading>
        {projectsData.map((project, index) => {
          const targetScale = 1 - (projectsData.length - index) * 0.05;
          return (
            <Project
              key={index}
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

export default Projects;
