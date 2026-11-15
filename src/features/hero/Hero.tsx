import LocalTime from '@/components/LocalTime';
import NowDot from '@/components/NowDot';
import { Button } from '@/components/ui/button';
import { site } from '@/content/site';
import { ui } from '@/content/ui';
import { plural, type Locale } from '@/lib/i18n';
import Contours from './Contours';
import PortraitCard from './PortraitCard';

// CSS rise, no fade: it starts at first paint, and an opacity fade on the LCP text would delay LCP until it ends.
const RISE = 'animate-in duration-700 ease-out-strong slide-in-from-bottom-[14px]';

const Hero = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].hero;
  return (
    <section id='home' className='relative overflow-hidden'>
      <div className='page-container relative pt-10 pb-12 min-[920px]:pt-20 min-[920px]:pb-18'>
        <div
          aria-hidden
          className='pointer-events-none absolute top-0 -right-35 z-0 flex h-81.5 w-140 items-center min-[920px]:-right-52.5 min-[920px]:bottom-0 min-[920px]:h-auto min-[920px]:w-275'>
          <div className='h-81.5 w-140 flex-none translate-y-6 min-[920px]:h-160 min-[920px]:w-275 min-[920px]:translate-y-10'>
            <Contours />
          </div>
        </div>
        <div className='relative z-10 flex flex-col gap-10 min-[920px]:flex-row min-[920px]:items-center min-[920px]:gap-16'>
          <div className={`${RISE} flex min-w-0 flex-col gap-7 min-[920px]:flex-[999_1_520px]`}>
            <span className='inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-card px-3 py-1.75 font-mono text-caption text-muted-foreground'>
              <NowDot />
              {site.availability[locale]}
            </span>
            <h1 className='text-display max-[920px]:leading-[1.04]'>{site.headline[locale]}</h1>
            <p className='max-w-155 text-lead text-muted-foreground'>{site.intro[locale]}</p>
            <div className='flex flex-wrap items-center gap-2.5'>
              <Button asChild size='cta' className='px-5.5'>
                <a href='#projects'>{copy.viewProjects}</a>
              </Button>
              <Button
                asChild
                size='cta'
                variant='outline'
                className='border-input bg-transparent px-5.5 text-foreground hover:border-muted-foreground hover:bg-transparent hover:text-foreground'>
                <a href='#contact'>{copy.contactMe}</a>
              </Button>
            </div>
          </div>
          <PortraitCard
            alt={copy.portrait}
            className='max-w-105 min-[920px]:max-w-85 min-[920px]:flex-[1_1_280px]'>
            <dl className='grid grid-cols-[64px_1fr] gap-y-2 text-label/[1.4]'>
              <dt className='font-mono text-syntax-keyword'>{copy.role}</dt>
              <dd className='text-foreground'>{site.role}</dd>
              <dt className='font-mono text-syntax-keyword'>{copy.based}</dt>
              <dd className='text-foreground'>
                {site.city}, {site.country},{' '}
                <span className='font-mono'>
                  <LocalTime timeZone={site.timeZone} locale={locale} />
                </span>
              </dd>
              <dt className='font-mono text-syntax-keyword'>{copy.stack}</dt>
              <dd className='text-foreground'>{site.stack.join(', ')}</dd>
              <dt className='font-mono text-syntax-keyword'>{copy.xp}</dt>
              <dd className='text-foreground'>{plural(locale, site.xpYears, copy.years)}</dd>
            </dl>
          </PortraitCard>
        </div>
      </div>
    </section>
  );
};

export default Hero;
