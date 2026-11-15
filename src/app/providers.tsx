'use client';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

const Providers = ({ children }: PropsWithChildren) => (
  <ThemeProvider
    attribute='data-theme'
    defaultTheme='dark'
    enableSystem={false}
    // shortcut: next-themes 0.4.6 inserts an inert script on client remounts; remove when upstream fixes it.
    scriptProps={{ type: typeof window === 'undefined' ? 'text/javascript' : 'text/plain' }}
    disableTransitionOnChange>
    <MotionConfig reducedMotion='user'>{children}</MotionConfig>
  </ThemeProvider>
);

export default Providers;
