'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import TextRevealOnScroll from '@/components/TextRevealOnScroll';
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
      <TextRevealOnScroll
        className='about-text mb-3'
        text="I build interfaces that feel effortless to use and memorable to look at. Frontend development, for me, is the sweet spot where logical problem-solving meets creative expression — transforming ideas into smooth, intuitive, and visually engaging experiences. I focus on writing clean, well-structured code and crafting designs that are both functional and delightful to interact with. I enjoy working with modern tools and frameworks to deliver software that is robust, elegant, and built to last. Beyond writing code, I pay attention to the small details that make a big difference, from subtle animations to polished interaction flows."
      />

      <TextRevealOnScroll
        className='about-text mb-3'
        text="I'm endlessly curious, always exploring new technologies, experimenting with UI animations, and refining interaction details that elevate the user experience. My goal isn't just to deliver features, but to craft software that people genuinely enjoy using."
      />

      <TextRevealOnScroll
        className='about-text'
        text="When I'm not coding, you'll find me hiking, reading, or tinkering with side projects—always learning, always building."
      />
    </motion.section>
  );
};

export default About;
