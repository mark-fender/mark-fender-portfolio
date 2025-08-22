'use client';

import { Dispatch, SetStateAction, createContext, useState, type PropsWithChildren } from 'react';
import { SectionName } from '@/types';

type ActiveSection = {
  activeSection: SectionName;
  setActiveSection: Dispatch<SetStateAction<SectionName>>;
  lastClickTime: number;
  setLastClickTime: Dispatch<SetStateAction<number>>;
} | null;

export const ActiveSectionContext = createContext<ActiveSection>(null);

const ActiveSectionContextProvider = ({ children }: PropsWithChildren) => {
  const [activeSection, setActiveSection] = useState<SectionName>('Home');
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  return (
    <ActiveSectionContext.Provider
      value={{ activeSection, setActiveSection, lastClickTime, setLastClickTime }}>
      {children}
    </ActiveSectionContext.Provider>
  );
};

export default ActiveSectionContextProvider;
