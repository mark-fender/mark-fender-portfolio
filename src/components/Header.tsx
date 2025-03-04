'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { navBarLinks } from '@/lib/data';
import useActiveSection from '@/hooks/useActiveSection';

const Header = () => {
  const { activeSection, setActiveSection, setLastClickTime } = useActiveSection();

  return (
    <header className='z-100 relative'>
      <motion.div className='fixed-header' initial={{ y: -100, x: '-50%', opacity: 0 }} animate={{ y: 0, x: '-50%', opacity: 1 }} transition={{ duration: 0.75 }} />
      <nav className='flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0'>
        <ul className='flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:flex-nowrap sm:gap-5'>
          {navBarLinks.map((link) => (
            <motion.li
              key={link.hash}
              className='h-3/4 flex items-center justify-center relative'
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75 }}>
              <Link
                href={link.hash}
                className={clsx(
                  'px-3 py-3 hover:text-gray-950 transition dark:hover:text-gray-300',
                  {
                    'text-gray-950 dark:text-gray-300': activeSection === link.name,
                  },
                )}
                onClick={() => {
                  setActiveSection(link.name);
                  setLastClickTime(Date.now());
                }}>
                {link.name}
                {link.name === activeSection ? (
                  <motion.span
                    className='bg-gray-200 rounded-full absolute inset-0 -z-10 dark:bg-gray-700'
                    layoutId='activeSection'
                    transition={{ type: 'spring', stiffness: 250, damping: 30 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
