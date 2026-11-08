'use client';

import { useRef } from 'react';
import SectionHeading from '@/components/SectionHeading';
import { experiencesData } from '@/lib/data';
import PositionDetail from '@/components/experience/PositionDetail';
import { motion, useScroll } from 'motion/react';

const Experience = () => {
  const experienceListRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: experienceListRef, offset: ['0 1', '1.33 1'] });

  return (
    <section id='experience'>
      <SectionHeading>My Experience</SectionHeading>
      <div ref={experienceListRef} className='relative w-[75%] mx-auto'>
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className='absolute left-2 top-0 w-1 h-full bg-slate-500 rounded-full hidden sm:block'
        />
        <ul className='sm:ml-16 overflow-hidden'>
          {experiencesData.map((position, index) => (
            <PositionDetail key={index} {...position} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Experience;
