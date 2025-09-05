"use client";

import { motion } from 'framer-motion';
import { experiencesData } from '@/lib/data';

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      delay: 0.1 * index,
    },
  }),
};

type TimelineItemProps = (typeof experiencesData)[number] & { index: number };

const TimelineItem = ({ title, company, description, date, index }: TimelineItemProps) => (
  <motion.li
    className='mb-16 last:mb-0 w-full mx-auto flex flex-col items-left justify-between'
    variants={fadeInAnimationVariants}
    initial='initial'
    whileInView='animate'
    viewport={{ once: true }}
    custom={index}>
    <h3 className='text-xl font-semibold'>
      {title} at {company}
    </h3>
    <span className='font-medium my-2 text-white/55'>{date}</span>
    <p className='w-full'>{description}</p>
  </motion.li>
);

export default TimelineItem;
