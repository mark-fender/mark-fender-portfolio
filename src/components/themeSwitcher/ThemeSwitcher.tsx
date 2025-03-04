'use client';

import { motion } from 'framer-motion';
import { BsLightbulbFill, BsLightbulbOff } from 'react-icons/bs';
import useThemeSwitcher from './hooks/useThemeSwitcher';

export enum ThemeModes {
  LIGHT = 'light',
  DARK = 'dark',
}

const ThemeSwitcher = () => {
  const { mounted, resolvedTheme, themeSwitchHandler } = useThemeSwitcher();

  if (!mounted) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'tween', duration: 0.25 }}
      className='theme-switcher'
      onClick={themeSwitchHandler}>
      {resolvedTheme && resolvedTheme === ThemeModes.LIGHT ? (
        <BsLightbulbOff />
      ) : (
        <BsLightbulbFill />
      )}
    </motion.button>
  );
};

export default ThemeSwitcher;
