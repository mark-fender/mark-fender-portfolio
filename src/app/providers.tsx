'use client';

import ActiveSectionContextProvider from '@/context/activeSectionContext';
import type { PropsWithChildren } from 'react';

const Providers = ({ children }: PropsWithChildren) => (
  <ActiveSectionContextProvider>{children}</ActiveSectionContextProvider>
);

export default Providers;
