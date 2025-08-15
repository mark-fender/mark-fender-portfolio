'use client';

import { projectsData } from '@/lib/data';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';

type ProjectProps = (typeof projectsData)[number] & {
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
};

const ProjectCard = ({
  index,
  progress,
  range,
  targetScale,
  title,
  description,
  tags,
}: ProjectProps) => {
  const projectRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <motion.div ref={projectRef} style={{ scale }} className='sticky top-24 sm:top-40'>
      <section style={{ top: `${index * 25}px` }} className='project-card'>
        <div>
          <h3 className='text-2xl font-semibold'>{title}</h3>
          <p className='mt-8 leading-relaxed'>{description}</p>
        </div>
        <ul className='hidden sm:flex flex-wrap mt-8 mb-2 gap-2 '>
          {tags.map((tag, index) => (
            <li
              key={index}
              className='bg-white/75 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-black rounded-full font-bold'>
              {tag}
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
};

export default ProjectCard;
