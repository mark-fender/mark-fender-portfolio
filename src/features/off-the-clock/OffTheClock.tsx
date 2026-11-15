import Image from 'next/image';
import Section from '@/components/section/Section';
import HoverUnderline from '@/components/HoverUnderline';
import SurfaceCard from '@/components/SurfaceCard';
import { sectionHeader } from '@/content/nav';
import { listening, nowItems, nowUpdated, photos } from '@/content/now';
import { ui } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import NowPlaying from './NowPlaying';

const OffTheClock = ({ locale }: { locale: Locale }) => {
  const header = sectionHeader('off-the-clock', locale);
  const copy = ui[locale].offTheClock;
  return (
    <Section id='off-the-clock' {...header}>
      <div className='mb-3.5 flex flex-col gap-3.5 min-[920px]:mb-10 min-[920px]:gap-5'>
        <h2 className='text-section'>{header.label}</h2>
        <p className='text-[17px]/[1.6] text-muted-foreground'>{copy.intro}</p>
      </div>
      <div className='flex flex-wrap gap-3.5 min-[920px]:gap-4'>
        <SurfaceCard
          interactive
          className='flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 bg-surface-raised p-4.5 min-[920px]:gap-5 min-[920px]:p-6'>
          <header className='flex items-baseline justify-between gap-3'>
            <h3 className='text-base font-semibold tracking-[-0.01em] min-[920px]:text-lg'>
              {copy.now}
            </h3>
            <span className='font-mono text-caption text-muted-foreground'>
              {nowUpdated[locale]}
            </span>
          </header>
          <dl className='flex flex-1 flex-col'>
            {nowItems.map(({ id, label, value, href }) => (
              <div
                key={id}
                className='grid flex-auto grid-cols-[80px_1fr] content-center gap-3 border-t border-border py-2.5 max-[920px]:last:pb-0 min-[920px]:grid-cols-[88px_1fr] min-[920px]:py-3.5'>
                <dt className='pt-0.5 font-mono text-caption text-muted-foreground'>
                  {label[locale]}
                </dt>
                <dd className='flex items-center gap-2.5 text-sm/normal min-[920px]:text-[15px]'>
                  {id === 'listening' ? (
                    <NowPlaying
                      fallback={value[locale]}
                      lastPlayedLabel={listening.lastPlayed[locale]}
                    />
                  ) : href ? (
                    <a
                      href={href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group inline-flex min-w-0 flex-col gap-0.5'>
                      <span>{value[locale]}</span>
                      <HoverUnderline />
                    </a>
                  ) : (
                    value[locale]
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </SurfaceCard>
        <div
          role='region'
          aria-label={copy.photos}
          tabIndex={0}
          className='flex min-w-0 flex-[2_1_620px] gap-2.5 overflow-x-auto max-[920px]:snap-x max-[920px]:snap-mandatory min-[920px]:grid min-[920px]:grid-cols-3 min-[920px]:gap-4 min-[920px]:overflow-visible'>
          {photos.map(({ src, alt, caption, focus }) => (
            <SurfaceCard
              key={src}
              interactive
              className='flex min-h-55 w-[70%] shrink-0 snap-start rounded-xl bg-surface-raised p-2.5 min-[920px]:min-h-85 min-[920px]:w-auto'>
              <figure className='relative m-0 flex-1 overflow-hidden rounded-md'>
                <Image
                  src={src}
                  alt={alt[locale]}
                  fill
                  sizes='(min-width: 920px) 320px, 70vw'
                  style={{ objectPosition: focus }}
                  className='object-cover saturate-[.7] contrast-[1.04]'
                />
                <figcaption className='absolute bottom-2 left-2 max-w-[calc(100%-1rem)] rounded-lg bg-background px-2.25 py-1.25 font-mono text-[11px] text-muted-foreground'>
                  {caption[locale]}
                </figcaption>
              </figure>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default OffTheClock;
