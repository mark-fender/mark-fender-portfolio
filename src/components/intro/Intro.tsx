'use client';

import Image from 'next/image';
import photo from '/public/assets/photo.jpeg';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsArrowRight, BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs';
import { TypeAnimation } from 'react-type-animation';
import useIntro from './hooks/useIntro';

const Intro = () => {
  const { isMobile, sectionRef, mounted } = useIntro();

  return (
    <section
      ref={sectionRef}
      className='mt-8 max-w-[75rem] text-center sm:mb-0 scroll-mt-36'
      id='home'>
      <div className='flex items-center justify-center pt-2'>
        <motion.div
          className='mb-8'
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'tween', duration: 0.6 }}>
          <Image
            src={photo}
            alt='marek-lipcak-portrait'
            width={256}
            height={256}
            quality='95'
            priority={true}
            className='rounded-full border-[0.15rem] border-gray-200 shadow-xl'
          />
        </motion.div>
      </div>
      <motion.h1
        className='w-fit h-fit mb-10 mt-16 px-8 text-xl font-!leading-[1.5] sm:text-2xl text-center sm:text-left'
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}>
        <span className='font-bold'>Hi, my name is Marek.</span> I am an experienced{' '}
        <span className='font-bold'>frontend developer</span> with{' '}
        <span className='font-bold'>6 years</span> of professional experience in web development. I
        am passionate about building responsive user interfaces with performance and attention to
        detail in mind. My main focus is on{' '}
        {mounted && isMobile ? (
          <span className='font-bold'>ReactJS</span>
        ) : (
          <TypeAnimation
            className='font-bold'
            sequence={['ReactJS.', 2000, 'NextJS.', 2000, 'Angular.', 2000]}
            speed={50}
            deletionSpeed={50}
            repeat={Infinity}
            style={{ fontSize: '1.5rem' }}
          />
        )}
      </motion.h1>
      <motion.div
        className='mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 tex-lg font-medium'
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}>
        <Link
          href='#contact'
          className='bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none
          focus:scale-105 hover:scale-105 hover:bg-gray-950 dark:bg-gray-950 active:scale-102 transition group'>
          Contact me <BsArrowRight className='opacity-70 group-hover:translate-x-1 transition' />
        </Link>
        <div className='flex flex-row gap-2'>
          <a
            href='https://linkedin.com/in/marek-lipčák'
            target='_blank'
            className='bg-white p-4 flex text-gray-700 items-center gap-2 rounded-full dark:text-white/60 dark:bg-white/10
            focus:scale-105 hover:text-gray-950 hover:scale-105 active:scale-102 transition group cursor-pointer'>
            <BsLinkedin />
          </a>

          <a
            href='https://www.instagram.com/marek.lipcak/'
            target='_blank'
            className='bg-white p-4 flex text-gray-700 items-center gap-2 rounded-full dark:text-white/60 dark:bg-white/10
            focus:scale-105 hover:text-gray-950 hover:scale-105 active:scale-102 transition group cursor-pointer'>
            <BsInstagram />
          </a>
          <a
            href='https://github.com/mark-fender'
            target='_blank'
            className='bg-white p-4 flex text-gray-700 items-center gap-2 rounded-full dark:text-white/60 dark:bg-white/10
            focus:scale-105 hover:text-gray-950 hover:scale-105 active:scale-102 transition group cursor-pointer'>
            <BsGithub />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Intro;
