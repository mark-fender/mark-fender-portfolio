'use client';
import { useSyncExternalStore } from 'react';
import { CLOCK_TICK_MS } from '@/design-system/motion';
import { formatClock } from '@/lib/time';

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, CLOCK_TICK_MS);
  return () => clearInterval(id);
};

const LocalTime = ({ timeZone }: { timeZone: string }) => {
  const time = useSyncExternalStore(
    subscribe,
    () => formatClock(new Date(), timeZone),
    () => '--:--',
  );
  return <time className='tabular-nums'>{time}</time>;
};
export default LocalTime;
