import { Fragment, type CSSProperties } from 'react';
import LocalTime from '@/components/LocalTime';
import { Button } from '@/components/ui/button';
import { site } from '@/content/site';
import { ui } from '@/content/ui';
import { plural, type Locale } from '@/lib/i18n';
import Contours from './Contours';
import PortraitCard from './PortraitCard';

// CSS starts the hero entrance before hydration.
const RISE = 'animate-rise motion-reduce:animate-none';
const at = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

const HEADLINE_S = 0.08;
const WORD_STAGGER_S = 0.06;
const INTRO_S = 0.35;
const ACTIONS_S = 0.5;
const ACTION_STAGGER_S = 0.08;
const DETAILS_S = 0.55;
const ROW_STAGGER_S = 0.07;
const row = (i: number, className: string) => ({
  className: `${RISE} ${className}`,
  style: at(DETAILS_S + i * ROW_STAGGER_S),
});

// Inline words keep the full headline as one LCP candidate.
const Headline = ({ text }: { text: string }) => (
  <h1
    className='animate-lift text-display motion-reduce:animate-none max-[920px]:leading-[1.04]'
    style={at(HEADLINE_S)}>
    {text.split(' ').map((word, i) => (
      <Fragment key={i}>
        {i > 0 && ' '}
        <span
          className='animate-word-brighten motion-reduce:animate-none'
          style={at(HEADLINE_S + i * WORD_STAGGER_S)}>
          {word}
        </span>
      </Fragment>
    ))}
  </h1>
);

const Hero = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].hero;
  return (
    <section id='home' className='relative overflow-hidden'>
      <div className='page-container relative pt-10 pb-20 min-[920px]:pt-20 min-[920px]:pb-36'>
        <div
          aria-hidden
          className='pointer-events-none absolute top-0 -right-35 z-0 flex h-81.5 w-140 items-center min-[920px]:-right-52.5 min-[920px]:bottom-0 min-[920px]:h-auto min-[920px]:w-275'>
          <div className='h-81.5 w-140 flex-none translate-y-6 min-[920px]:h-160 min-[920px]:w-275 min-[920px]:translate-y-10'>
            <Contours />
          </div>
        </div>
        <div className='relative z-10 flex flex-col gap-10 min-[920px]:flex-row min-[920px]:items-center min-[920px]:gap-16'>
          <div className='flex min-w-0 flex-col gap-7 min-[920px]:flex-[999_1_520px]'>
            {/* <span
              className={`${RISE} inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-card px-3 py-1.75 font-mono text-caption text-muted-foreground`}>
              <NowDot />
              {site.availability[locale]}
            </span> */}
            <Headline text={site.headline[locale]} />
            <p className={`${RISE} max-w-155 text-lead text-muted-foreground`} style={at(INTRO_S)}>
              {site.intro[locale]}
            </p>
            <div className='flex flex-wrap items-center gap-2.5'>
              <Button asChild size='cta' className={`${RISE} px-5.5`} style={at(ACTIONS_S)}>
                <a href='#projects'>{copy.viewProjects}</a>
              </Button>
              <Button
                asChild
                size='cta'
                variant='outline'
                style={at(ACTIONS_S + ACTION_STAGGER_S)}
                className='animate-rise border-input bg-transparent px-5.5 text-foreground hover:border-muted-foreground hover:bg-transparent hover:text-foreground motion-reduce:animate-none'>
                <a href='#contact'>{copy.contactMe}</a>
              </Button>
            </div>
          </div>
          <PortraitCard
            alt={copy.portrait}
            className='max-w-105 min-[920px]:max-w-85 min-[920px]:flex-[1_1_280px]'>
            <dl className='grid grid-cols-[64px_1fr] gap-y-2 text-label/[1.4]'>
              <dt {...row(0, 'font-mono text-syntax-keyword')}>{copy.role}</dt>
              <dd {...row(0, 'text-foreground')}>{site.role}</dd>
              <dt {...row(1, 'font-mono text-syntax-keyword')}>{copy.based}</dt>
              <dd {...row(1, 'text-foreground')}>
                {site.city}, {site.country},{' '}
                <span className='font-mono'>
                  <LocalTime timeZone={site.timeZone} locale={locale} />
                </span>
              </dd>
              <dt {...row(2, 'font-mono text-syntax-keyword')}>{copy.stack}</dt>
              <dd {...row(2, 'text-foreground')}>{site.stack.join(', ')}</dd>
              <dt {...row(3, 'font-mono text-syntax-keyword')}>{copy.xp}</dt>
              <dd {...row(3, 'text-foreground')}>{plural(locale, site.xpYears, copy.years)}</dd>
            </dl>
          </PortraitCard>
        </div>
      </div>
      {/* Fade contours at all four clipping edges, behind the hero content. */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          backgroundImage: [
            'linear-gradient(to right, var(--background), transparent 3rem, transparent calc(100% - 3rem), var(--background))',
            'linear-gradient(to bottom, var(--background), transparent 3rem, transparent calc(100% - 3rem), var(--background))',
          ].join(', '),
        }}
      />
    </section>
  );
};

export default Hero;
