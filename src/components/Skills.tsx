'use client';

import { motion } from 'motion/react';
import { skillsData } from '@/lib/data';
import SectionHeading from '@/components/SectionHeading';

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

const Skills = () => {
  return (
    <section className='max-w-[53rem] scroll-mt-36 text-center' id='skills'>
      <SectionHeading>My skills</SectionHeading>
      <ul className='skills-list'>
        {skillsData.map(({ name, icon: Icon }, index) => (
          <motion.li
            key={name}
            className='skill-item flex items-center gap-2'
            variants={fadeInAnimationVariants}
            initial={'initial'}
            whileInView='animate'
            viewport={{ once: true }}
            custom={index}>
            <Icon />
            <span>{name}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;
