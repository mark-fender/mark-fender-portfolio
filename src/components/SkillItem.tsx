'use client';

import { ComponentType } from 'react';
import { motion } from 'framer-motion';

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

interface SkillItemProps {
  name: string;
  icon: ComponentType;
  index: number;
}

const SkillItem = ({ name, icon: Icon, index }: SkillItemProps) => (
  <motion.li
    className='skill-item flex items-center gap-2'
    variants={fadeInAnimationVariants}
    initial='initial'
    whileInView='animate'
    viewport={{ once: true }}
    custom={index}>
    <Icon />
    <span>{name}</span>
  </motion.li>
);

export default SkillItem;

