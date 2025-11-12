import useIsMobile from '@/hooks/useIsMobile';
import useSectionInView from '@/hooks/useSectionInView';
import { useState, useEffect } from 'react';

const useIntro = () => {
  const { isMobile } = useIsMobile();
  const { sectionRef } = useSectionInView({
    sectionName: 'Home',
    threshold: isMobile ? 0.25 : 0.75,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return {
    isMobile,
    sectionRef,
    mounted,
  };
};

export default useIntro;
