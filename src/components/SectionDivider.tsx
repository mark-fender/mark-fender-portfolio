'use client';

import { motion } from 'framer-motion';

const SectionDivider = () => (
  <motion.div
    className='section-divider'
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
  />
);

export default SectionDivider;
