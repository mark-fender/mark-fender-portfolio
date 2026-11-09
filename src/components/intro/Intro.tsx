import { ArrowRight } from 'lucide-react';
import Contours from '@/components/intro/Contours';
import PortraitCard from '@/components/intro/PortraitCard';
import RotatingWord from '@/components/intro/RotatingWord';
import StatusLine from '@/components/intro/StatusLine';
import { Button } from '@/components/ui/button';
import { siteMeta, socialLinks } from '@/lib/data';

const ROLE = 'frontend developer';
const FOCUS_WORDS = ['ReactJS.', 'NextJS.', 'Angular.'];
const FOCUS = FOCUS_WORDS.map((w) => w.replace(/\.$/, '')).join(' · ');
// CSS rise, no fade: it starts at first paint, and an opacity fade on the LCP text would delay LCP until it ends.
const RISE = 'animate-in duration-700 ease-out-strong slide-in-from-bottom-[14px]';

const Strong = ({ children }: { children: string }) => (
  <strong className='font-medium text-foreground'>{children}</strong>
);

const Intro = () => (
  <section id='home' className='relative overflow-hidden'>
    <div className='page-container relative pt-10 pb-12 min-[920px]:pt-22 min-[920px]:pb-14'>
      <Contours />
      {/* Below 920px the text column dissolves (contents) so the portrait can sit between the
          h1 and the intro: one set of markup, reordered in a single flex column. */}
      <div className='relative z-10 flex flex-col gap-[22px] min-[920px]:flex-row min-[920px]:items-center min-[920px]:gap-18'>
        <div className='contents min-[920px]:flex min-[920px]:min-w-0 min-[920px]:flex-[999_1_560px] min-[920px]:flex-col min-[920px]:gap-7'>
          <span
            className={`${RISE} max-[920px]:order-1 inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-card px-3 py-[7px] font-mono text-caption text-muted-foreground`}>
            <span className='size-[7px] animate-now-ring rounded-full bg-primary' />
            {siteMeta.availability}
          </span>
          <h1 className={`${RISE} text-display max-[920px]:order-2`}>
            Hi, my name <br className='max-[920px]:hidden' />
            is Marek.
          </h1>
          <p
            className={`${RISE} max-w-[620px] text-lead text-muted-foreground max-[920px]:order-4`}>
            I am a <Strong>{ROLE}</Strong> with{' '}
            <Strong>{`${siteMeta.experienceYears} years`}</Strong> of professional experience in web
            development. I specialize in building <Strong>responsive</Strong>,{' '}
            <Strong>high-performance</Strong> user interfaces with a strong focus on{' '}
            <Strong>usability</Strong> and <Strong>attention to detail</Strong>. My main focus is on{' '}
            <RotatingWord words={FOCUS_WORDS} />
          </p>
          <div className={`${RISE} flex flex-wrap items-center gap-2.5 max-[920px]:order-5`}>
            <Button asChild size='cta' className='px-[22px] max-[920px]:flex-1'>
              <a href='#contact'>
                Contact me
                <ArrowRight className='size-[18px]' strokeWidth={1.75} aria-hidden />
              </a>
            </Button>
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Button
                key={label}
                asChild
                variant='outline'
                className='size-[50px] rounded-full border-input bg-transparent text-foreground hover:border-muted-foreground hover:bg-transparent active:scale-[.97]'>
                <a href={href} target='_blank' rel='noopener noreferrer' aria-label={label}>
                  <Icon className='size-5' aria-hidden />
                </a>
              </Button>
            ))}
          </div>
        </div>
        <PortraitCard className='max-[920px]:order-3 max-[920px]:max-w-[420px] min-[920px]:max-w-[380px] min-[920px]:flex-[1_1_300px]'>
          <dl className='grid grid-cols-[56px_1fr] gap-y-2 text-label'>
            <dt className='font-mono text-syntax-keyword'>role</dt>
            <dd className='text-foreground'>{ROLE.charAt(0).toUpperCase() + ROLE.slice(1)}</dd>
            <dt className='font-mono text-syntax-keyword'>years</dt>
            <dd className='font-mono text-syntax-number'>{siteMeta.experienceYears}</dd>
            <dt className='font-mono text-syntax-keyword'>focus</dt>
            <dd className='text-foreground'>{FOCUS}</dd>
          </dl>
        </PortraitCard>
      </div>
      <StatusLine />
    </div>
  </section>
);

export default Intro;
