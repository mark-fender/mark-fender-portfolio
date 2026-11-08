'use client';

import { motion } from 'motion/react';

const SectionDivider = () => (
  <motion.div
    className='section-divider'
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
  />
);

export default SectionDivider;
