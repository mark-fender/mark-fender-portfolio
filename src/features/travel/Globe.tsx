'use client';
import { Minus, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import type { UiCopy } from '@/content/ui';
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
const zoomButton =
  'inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-[scale,border-color] duration-160 ease-out-strong enabled:hover:border-muted-foreground enabled:active:scale-[.97] disabled:opacity-40';

type Props = {
  visited: readonly CountryCode[];
  locale: Locale;
  copy: UiCopy['travel']['globe'];
};

const Globe = ({ visited, locale, copy }: Props) => {
  const frame = useRef<HTMLDivElement>(null);
  const near = useNearViewport(frame);
  const [zoom, setZoom] = useState(1);
  const zoomOut = ZOOMS.filter((stop) => stop < zoom - ON_STOP).pop();
  const zoomIn = ZOOMS.find((stop) => stop > zoom + ON_STOP);
  const [place, setPlace] = useState<Place | null>(null);

  return (
    <>
      <div
        ref={frame}
        className='relative mx-auto aspect-square w-full max-w-160 min-[920px]:col-span-2 min-[920px]:col-start-1 min-[920px]:row-start-3'>
        {/* The empty sphere, same size as the drawn one: the card has its shape before the globe loads. */}
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
            zoomRange={ZOOM_RANGE}
            onHover={setPlace}
            onZoom={setZoom}
          />
        )}
      </div>
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
            disabled={zoomOut === undefined}
            onClick={() => zoomOut && setZoom(zoomOut)}
            className={zoomButton}>
            <Minus className='size-4.5' strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type='button'
            aria-label={copy.zoomIn}
            disabled={zoomIn === undefined}
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
