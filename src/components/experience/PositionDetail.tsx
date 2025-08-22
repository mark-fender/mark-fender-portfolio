import { motion } from 'framer-motion';
import type { experiencesData } from '@/lib/data';

const FADE_IN_VARIANTS = {
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

type PositionDetailProps = (typeof experiencesData)[number] & { index: number };

const PositionDetail = ({ title, company, description, date, index }: PositionDetailProps) => (
  <motion.li
    className='mb-16 last:mb-0 w-full mx-auto flex flex-col items-left justify-between'
    variants={FADE_IN_VARIANTS}
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

export default PositionDetail;
