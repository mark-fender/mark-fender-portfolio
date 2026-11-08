'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { Accordion } from '@/components/ui/accordion';

const query = '(min-width: 920px)';
const subscribe = (onChange: () => void) => {
  const mql = matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

// The current role is open on desktop; below 920px the list starts collapsed like the mobile
// reference. The server snapshot is "desktop", so the HTML matches and hydration is clean; the
// section is far below the fold, so the switch after hydration isn't visible.
const ExperienceAccordion = ({ children }: { children: ReactNode }) => {
  const desktop = useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => true,
  );
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <Accordion
      type='single'
      collapsible
      value={chosen ?? (desktop ? 'item-0' : '')}
      onValueChange={setChosen}
      asChild>
      {children}
    </Accordion>
  );
};

export default ExperienceAccordion;
