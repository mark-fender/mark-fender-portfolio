import useSectionInView from '@/hooks/useSectionInView';
import { useScroll } from 'motion/react';
import { useRef } from 'react';

const useProjectList = () => {
  const { sectionRef } = useSectionInView({ sectionName: 'Projects', threshold: 0.2 });
  const projectsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: projectsRef,
    offset: ['start end', 'end end'],
  });

  return { sectionRef, projectsRef, scrollYProgress };
};

export default useProjectList;
