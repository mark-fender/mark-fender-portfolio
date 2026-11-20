import * as m from 'motion/react-client';
import Image from 'next/image';
import RevealHeading from '@/components/motion/RevealHeading';
import NewTabCue from '@/components/NewTabCue';
import Section from '@/components/section/Section';
import HoverUnderline from '@/components/HoverUnderline';
import SurfaceCard from '@/components/SurfaceCard';
import { sectionHeader } from '@/content/nav';
import { listening, nowItems, nowUpdated, photos } from '@/content/now';
import { ui } from '@/content/ui';
import { delayed, duration, ease, inView, variants } from '@/design-system/motion';
import type { Locale } from '@/lib/i18n';
import NowPlaying from './NowPlaying';

const nowCard = {
  hidden: variants.fromLeft.hidden,
  show: {
    ...variants.fromLeft.show,
    transition: {
      ...variants.fromLeft.show.transition,
      delayChildren: 0.25,
      staggerChildren: 0.08,
    },
  },
};

const DEVELOP_WIPE_S = 0.9;
const DEVELOP_SETTLE_S = 1.5;
const photoIn = (i: number) => {
  const at = 0.2 + i * 0.14;
  return {
    card: {
      hidden: { opacity: 0, y: 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: { delay: at, duration: duration.enter, ease: ease.out },
      },
    },
    frame: {
      hidden: { clipPath: 'inset(100% 0% 0% 0% round 6px)' },
      show: {
        clipPath: 'inset(0% 0% 0% 0% round 6px)',
        transition: { delay: at + 0.1, duration: DEVELOP_WIPE_S, ease: ease.inOut },
      },
    },
    picture: {
      hidden: { scale: 1.18, filter: 'saturate(0) contrast(1.04) brightness(0.7)' },
      show: {
        scale: 1,
        filter: 'saturate(0.7) contrast(1.04) brightness(1)',
        transition: { delay: at + 0.1, duration: DEVELOP_SETTLE_S, ease: ease.out },
      },
    },
    caption: {
      hidden: { opacity: 0, x: -10 },
      show: {
        opacity: 1,
        x: 0,
        transition: { delay: at + 0.85, duration: duration.item, ease: ease.out },
      },
    },
  };
};

const OffTheClock = ({ locale }: { locale: Locale }) => {
  const header = sectionHeader('off-the-clock', locale);
  const copy = ui[locale].offTheClock;
  return (
    <Section id='off-the-clock' {...header}>
      <div className='mb-3.5 flex flex-col gap-3.5 min-[920px]:mb-10 min-[920px]:gap-5'>
        <RevealHeading className='text-section' text={header.label} />
        <m.p
          initial='hidden'
          whileInView='show'
          viewport={inView}
          variants={delayed(variants.rise, 0.15)}
          className='max-w-measure text-lead text-muted-foreground min-[920px]:max-w-none'>
          {copy.intro}
        </m.p>
      </div>
      <div className='flex flex-wrap gap-3.5 min-[920px]:gap-4'>
        <m.div
          initial='hidden'
          whileInView='show'
          viewport={inView}
          variants={nowCard}
          className='flex min-w-0 flex-[1_1_320px]'>
          <SurfaceCard
            interactive
            className='flex min-w-0 flex-1 flex-col gap-3.5 bg-surface-raised p-4.5 min-[920px]:gap-5 min-[920px]:p-6'>
            <header className='flex items-baseline justify-between gap-3'>
              <h3 className='text-title'>{copy.now}</h3>
              <span className='font-mono text-caption text-muted-foreground'>
                {nowUpdated[locale]}
              </span>
            </header>
            <dl className='flex flex-1 flex-col'>
              {nowItems.map(({ id, label, value, href }) => (
                <m.div
                  key={id}
                  variants={variants.item}
                  className='grid flex-auto grid-cols-[80px_1fr] content-center gap-3 border-t border-border py-2.5 max-[920px]:last:pb-0 min-[920px]:grid-cols-[88px_1fr] min-[920px]:py-3.5'>
                  <dt className='pt-0.5 font-mono text-caption text-muted-foreground'>
                    {label[locale]}
                  </dt>
                  <dd
                    lang={value.en === value.sk ? 'en' : undefined}
                    className='flex items-center gap-2.5 text-ui'>
                    {id === 'listening' ? (
                      <NowPlaying
                        locale={locale}
                        newTabLabel={ui[locale].newTab}
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
                        <NewTabCue locale={locale} text={ui[locale].newTab} />
                        <HoverUnderline />
                      </a>
                    ) : (
                      value[locale]
                    )}
                  </dd>
                </m.div>
              ))}
            </dl>
          </SurfaceCard>
        </m.div>
        <div
          role='region'
          aria-label={copy.photos}
          tabIndex={0}
          className='flex min-w-0 flex-[2_1_620px] gap-2.5 overflow-x-auto max-[920px]:snap-x max-[920px]:snap-mandatory min-[920px]:grid min-[920px]:grid-cols-3 min-[920px]:gap-4 min-[920px]:overflow-visible'>
          {photos.map(({ src, alt, caption, focus }, i) => {
            const enter = photoIn(i);
            return (
              <m.div
                key={src}
                initial='hidden'
                whileInView='show'
                viewport={inView}
                variants={enter.card}
                className='flex min-h-55 w-[70%] shrink-0 snap-start min-[920px]:min-h-85 min-[920px]:w-auto'>
                <SurfaceCard interactive className='flex flex-1 rounded-xl bg-surface-raised p-2.5'>
                  <m.figure
                    variants={enter.frame}
                    className='relative m-0 flex-1 overflow-hidden rounded-md'>
                    <m.div variants={enter.picture} className='absolute inset-0'>
                      <Image
                        src={src}
                        alt={alt[locale]}
                        fill
                        sizes='(min-width: 920px) 320px, 70vw'
                        style={{ objectPosition: focus }}
                        className='object-cover'
                      />
                    </m.div>
                    <m.figcaption
                      variants={enter.caption}
                      className='absolute bottom-2 left-2 max-w-[calc(100%-1rem)] rounded-lg bg-background px-2.25 py-1.25 font-mono text-caption text-muted-foreground'>
                      {caption[locale]}
                    </m.figcaption>
                  </m.figure>
                </SurfaceCard>
              </m.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default OffTheClock;
