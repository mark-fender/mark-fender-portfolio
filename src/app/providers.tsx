'use client';

import ActiveSectionContextProvider from '@/context/activeSectionContext';
import { ReactNode } from 'react';

const Providers = ({ children }: { children: ReactNode }) => (
  <ActiveSectionContextProvider>{children}</ActiveSectionContextProvider>
);

export default Providers;
