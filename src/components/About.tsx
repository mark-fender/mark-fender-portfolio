'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import useSectionInView from '@/hooks/useSectionInView';
import useIsMobile from '@/hooks/useIsMobile';

const About = () => {
  const { isMobile } = useIsMobile();
  const { sectionRef } = useSectionInView({
    sectionName: 'About',
    threshold: isMobile ? 0.2 : 0.8,
  });

  return (
    <motion.section
      ref={sectionRef}
      className='max-w-[45rem] text-center leading-8 scroll-mt-36'
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      id='about'>
      <SectionHeading>About me</SectionHeading>
      <p className='about-text mb-3'>
        I build interfaces that feel effortless to use and memorable to look at. Frontend
        development, for me, is the sweet spot where logical problem-solving meets creative
        expression — transforming ideas into smooth, intuitive, and visually engaging experiences. I
        focus on writing <span className='font-medium'>clean, well-structured code</span> and
        crafting designs that are both functional and delightful to interact with. I enjoy working
        with <span className='font-medium'>modern tools and frameworks</span> to deliver software
        that is robust, elegant, and built to last. Beyond writing code, I pay attention to the
        small details that make a big difference, from subtle animations to polished interaction
        flows.
      </p>

      <p className='about-text mb-3'>
        I&apos;m endlessly curious, always exploring new technologies, experimenting with UI
        animations, and refining interaction details that elevate the user experience. My goal
        isn&apos;t just to deliver features, but to craft software that people genuinely enjoy
        using.
      </p>

      <p className='about-text'>
        When I&apos;m not coding, you&apos;ll find me hiking, reading, or tinkering with side
        projects&mdash;always learning, always building.
      </p>
    </motion.section>
  );
};

export default About;
