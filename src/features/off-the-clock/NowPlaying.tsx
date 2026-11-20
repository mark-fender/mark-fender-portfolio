'use client';
import { useEffect, useRef, useState } from 'react';
import HoverUnderline from '@/components/HoverUnderline';
import NewTabCue from '@/components/NewTabCue';
import useNearViewport from '@/hooks/useNearViewport';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Listening } from './spotify';

const POLL_MS = 60_000;
const EQ_DELAYS = ['0s', '-0.4s', '-0.8s'];

const Equaliser = ({ playing }: { playing: boolean }) => (
  <span aria-hidden className='flex h-lh shrink-0 items-center'>
    <span className='inline-flex h-3 items-end gap-0.5'>
      {EQ_DELAYS.map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: delay }}
          className={cn(
            'h-3 w-0.75 origin-bottom rounded-[1px] bg-muted-foreground',
            playing ? 'animate-eq' : 'scale-y-35',
          )}
        />
      ))}
    </span>
  </span>
);

type Props = { fallback: string; lastPlayedLabel: string; locale: Locale; newTabLabel: string };

const NowPlaying = ({ fallback, lastPlayedLabel, locale, newTabLabel }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const near = useNearViewport(ref);
  const [track, setTrack] = useState<Listening | null>(null);

  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    const load = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/listening');
        if (!res.ok) return;
        const next = (await res.json()) as Listening | null;
        // Null means Spotify has nothing or is down: go back to the written value.
        if (!cancelled) setTrack(next);
      } catch {
        // Offline or the route failed: keep what is shown.
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    document.addEventListener('visibilitychange', load);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', load);
    };
  }, [near]);

  return (
    <span ref={ref} className='flex min-w-0 items-start gap-2.5'>
      <Equaliser playing={track?.playing ?? true} />
      {track ? (
        <span className='flex min-w-0 flex-wrap items-baseline gap-x-2'>
          <a
            href={track.url}
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex min-w-0 flex-col gap-0.5'>
            <span>
              {track.title} · {track.artist}
            </span>
            <NewTabCue locale={locale} text={newTabLabel} />
            <HoverUnderline />
          </a>
          {!track.playing && (
            <span lang={locale} className='font-mono text-caption text-muted-foreground'>
              {lastPlayedLabel}
            </span>
          )}
        </span>
      ) : (
        fallback
      )}
    </span>
  );
};

export default NowPlaying;
