'use client';
import { Minus, Plus } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import type { UiCopy } from '@/content/ui';
import { ease, GLOBE_RISE_S, inView } from '@/design-system/motion';
import useNearViewport from '@/hooks/useNearViewport';
import { fill, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { CountryCode } from './data/countries';
import type { Place } from './GlobeCanvas';

const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), { ssr: false });

// The buttons move between these stops; a pinch can rest anywhere between the first and the last.
const ZOOMS = [1, 1.6, 2.4];
const ZOOM_RANGE = [ZOOMS[0]!, ZOOMS.at(-1)!] as const;
// A pinch rarely lands exactly on a stop: this close counts as being on it.
const ON_STOP = 0.02;
// aria-disabled, not disabled: at the last stop the pressed button keeps its focus.
const zoomButton =
  'inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-[scale,border-color] duration-fast ease-out-strong not-aria-disabled:hover:border-muted-foreground not-aria-disabled:active:scale-[.97] aria-disabled:cursor-not-allowed aria-disabled:opacity-40';

type Props = {
  visited: readonly CountryCode[];
  locale: Locale;
  copy: UiCopy['travel']['globe'];
};

const Globe = ({ visited, locale, copy }: Props) => {
  const frame = useRef<HTMLDivElement>(null);
  const near = useNearViewport(frame);
  const shown = useInView(frame, inView);
  const [zoom, setZoom] = useState(1);
  const zoomOut = ZOOMS.filter((stop) => stop < zoom - ON_STOP).pop();
  const zoomIn = ZOOMS.find((stop) => stop > zoom + ON_STOP);
  const [place, setPlace] = useState<Place | null>(null);

  return (
    <>
      <motion.div
        ref={frame}
        initial={{ opacity: 0, y: 56, scale: 0.9 }}
        animate={shown ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: GLOBE_RISE_S, ease: ease.out }}
        className='relative mx-auto aspect-square w-full max-w-160 min-[920px]:col-span-2 min-[920px]:col-start-1 min-[920px]:row-start-3'>
        <div
          aria-hidden
          className='absolute inset-[4.67%] rounded-full border border-border bg-globe-sea'
        />
        {near && (
          <GlobeCanvas
            visited={visited}
            locale={locale}
            label={copy.label}
            zoom={zoom}
            play={shown}
            zoomRange={ZOOM_RANGE}
            onHover={setPlace}
            onZoom={setZoom}
          />
        )}
      </motion.div>
      <div className='flex items-center justify-between gap-4 min-[920px]:contents'>
        <p
          aria-live='polite'
          className={cn(
            'relative z-10 min-h-5 font-mono text-label min-[920px]:col-start-1 min-[920px]:row-start-3 min-[920px]:self-end',
            place?.visited ? 'text-primary' : 'text-muted-foreground',
          )}>
          {place && (place.visited ? fill(copy.visited, { name: place.name }) : place.name)}
        </p>
        <div
          role='group'
          aria-label={copy.zoom}
          className='relative z-10 inline-flex gap-2 min-[920px]:col-start-2 min-[920px]:row-start-3 min-[920px]:self-end min-[920px]:justify-self-end'>
          <button
            type='button'
            aria-label={copy.zoomOut}
            aria-disabled={zoomOut === undefined || undefined}
            onClick={() => zoomOut && setZoom(zoomOut)}
            className={zoomButton}>
            <Minus className='size-4.5' strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type='button'
            aria-label={copy.zoomIn}
            aria-disabled={zoomIn === undefined || undefined}
            onClick={() => zoomIn && setZoom(zoomIn)}
            className={zoomButton}>
            <Plus className='size-4.5' strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
    </>
  );
};

export default Globe;
