import { motion } from 'framer-motion';
import { experiencesData } from '../lib/data';

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.15 * index,
    },
  }),
};

type PositionDetailProps = (typeof experiencesData)[number] & { index: number };

const PositionDetail = ({ title, company, description, date, index }: PositionDetailProps) => (
  <motion.li
    className='mb-16 last:mb-0 w-full mx-auto flex flex-col items-left justify-between'
    variants={fadeInAnimationVariants}
    initial={'initial'}
    whileInView='animate'
    viewport={{ once: true }}
    custom={index}>
    <h3 className='font-bold text-size-3xl'>
      {title} at {company}
    </h3>
    <span className='font-medium my-2 text-gray-950/55 dark:text-white/55'>{date}</span>
    <p className='w-full'> {description}</p>
  </motion.li>
);

export default PositionDetail;
