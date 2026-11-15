'use client';
import { useSyncExternalStore } from 'react';
import { CLOCK_TICK_MS } from '@/design-system/motion';
import type { Locale } from '@/lib/i18n';
import { formatClock } from '@/lib/time';

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, CLOCK_TICK_MS);
  return () => clearInterval(id);
};

const LocalTime = ({ timeZone, locale }: { timeZone: string; locale: Locale }) => {
  const time = useSyncExternalStore(
    subscribe,
    () => formatClock(new Date(), timeZone, locale),
    () => '--:--',
  );
  return <time className='tabular-nums'>{time}</time>;
};
export default LocalTime;
