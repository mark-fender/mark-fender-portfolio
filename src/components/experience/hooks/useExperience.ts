import useIsMobile from '@/hooks/useIsMobile';
import useSectionInView from '@/hooks/useSectionInView';
import { useScroll } from 'framer-motion';
import { useRef } from 'react';

const useExperience = () => {
  const isMobile = useIsMobile();
  const { sectionRef } = useSectionInView({
    sectionName: 'Experience',
    threshold: isMobile ? 0.3 : 0.5,
  });
  const experienceListRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: experienceListRef, offset: ['0 1', '1.33 1'] });

  return {
    sectionRef,
    experienceListRef,
    scrollYProgress,
  };
};

export default useExperience;
