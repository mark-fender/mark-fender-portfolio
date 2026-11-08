import { ChevronRight } from 'lucide-react';
import Contours from '@/components/intro/Contours';
import PortraitCard from '@/components/intro/PortraitCard';
import RotatingWord from '@/components/intro/RotatingWord';
import StatusLine from '@/components/intro/StatusLine';
import { Button } from '@/components/ui/button';
import { siteMeta, socialLinks } from '@/lib/data';

const FOCUS_WORDS = ['ReactJS.', 'NextJS.', 'Angular.'];

const Strong = ({ children }: { children: string }) => (
  <strong className='font-medium text-foreground'>{children}</strong>
);

const Intro = () => (
  <section id='home' className='relative overflow-hidden'>
    <div className='page-container relative pt-22 pb-14'>
      <Contours />
      <div className='relative z-10 flex flex-wrap items-center gap-18'>
        {/* CSS rise, no fade: it starts at first paint, and an opacity fade on the LCP text would delay LCP until it ends. */}
        <div className='flex min-w-0 flex-[999_1_560px] animate-in flex-col gap-7 duration-700 ease-out-strong slide-in-from-bottom-[14px]'>
          <span className='inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-card px-3 py-[7px] font-mono text-caption text-muted-foreground'>
            <span className='size-[7px] animate-now-ring rounded-full bg-primary' />
            {siteMeta.availability}
          </span>
          <h1 className='text-display'>
            Hi, my name
            <br />
            is Marek.
          </h1>
          <p className='max-w-[620px] text-lead text-muted-foreground'>
            I am a <Strong>frontend developer</Strong> with <Strong>7 years</Strong> of professional
            experience in web development. I specialize in building <Strong>responsive</Strong>,{' '}
            <Strong>high-performance</Strong> user interfaces with a strong focus on{' '}
            <Strong>usability</Strong> and <Strong>attention to detail</Strong>. My main focus is on{' '}
            <RotatingWord words={FOCUS_WORDS} />
          </p>
          <div className='flex flex-wrap items-center gap-2.5'>
            <Button
              asChild
              className='h-[50px] gap-2.5 rounded-full px-[22px] text-base active:scale-[.97]'>
              <a href='#contact'>
                Contact me
                <ChevronRight className='size-[18px]' strokeWidth={1.75} aria-hidden />
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
        <PortraitCard>
          <dl className='grid grid-cols-[56px_1fr] gap-y-2 text-label'>
            <dt className='font-mono text-syntax-keyword'>role</dt>
            <dd className='text-foreground'>{siteMeta.currentRole}</dd>
            <dt className='font-mono text-syntax-keyword'>years</dt>
            <dd className='font-mono text-syntax-number'>[placeholder]</dd>
            <dt className='font-mono text-syntax-keyword'>focus</dt>
            <dd className='text-foreground'>[placeholder]</dd>
          </dl>
        </PortraitCard>
      </div>
      <StatusLine />
    </div>
  </section>
);

export default Intro;
