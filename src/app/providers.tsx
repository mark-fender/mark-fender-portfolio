'use client';

import ActiveSectionContextProvider from '@/context/activeSectionContext';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

const Providers = ({ children }: PropsWithChildren) => (
  <ThemeProvider
    attribute='data-theme'
    defaultTheme='dark'
    enableSystem={false}
    disableTransitionOnChange>
    <MotionConfig reducedMotion='user'>
      <ActiveSectionContextProvider>{children}</ActiveSectionContextProvider>
    </MotionConfig>
  </ThemeProvider>
);

export default Providers;
