import * as m from 'motion/react-client';
import HoverUnderline from '@/components/HoverUnderline';
import RevealHeading from '@/components/motion/RevealHeading';
import NewTabCue from '@/components/NewTabCue';
import Section from '@/components/section/Section';
import SurfaceCard from '@/components/SurfaceCard';
import { socials } from '@/content/site';
import { ui } from '@/content/ui';
import { delayed, inView, stagger, variants } from '@/design-system/motion';
import type { Locale } from '@/lib/i18n';
import ContactForm from './ContactForm';
import { socialIcons } from './icons';

const Contact = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].contact;
  return (
    <Section id='contact'>
      <RevealHeading
        className='mb-8 max-w-225 text-display min-[920px]:mb-14'
        text={copy.heading}
      />
      <div className='flex flex-col gap-4.5 min-[920px]:flex-row min-[920px]:flex-wrap min-[920px]:gap-12'>
        <div className='contents min-[920px]:flex min-[920px]:flex-[1_1_340px] min-[920px]:flex-col min-[920px]:justify-between min-[920px]:gap-10'>
          <m.p
            initial='hidden'
            whileInView='show'
            viewport={inView}
            variants={delayed(variants.fromLeft, 0.2)}
            className='text-lead text-muted-foreground min-[920px]:max-w-105'>
            {copy.intro}
          </m.p>
          <m.ul
            initial='hidden'
            whileInView='show'
            viewport={inView}
            variants={stagger(0.08, 0.3)}
            className='border-b border-border max-[920px]:order-1 max-[920px]:mt-6 min-[920px]:max-w-105'>
            {socials.map(({ label, href }) => {
              const Icon = socialIcons[label];
              return (
                <m.li key={label} variants={variants.fromLeft} className='border-t border-border'>
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex items-center justify-between py-3.5 text-ui min-[920px]:py-4 min-[920px]:text-body/normal'>
                    <span className='flex items-center gap-3'>
                      <Icon aria-hidden className='size-[1.1em] shrink-0 text-muted-foreground' />
                      <span className='flex flex-col gap-0.75'>
                        {label}
                        <NewTabCue locale={locale} text={ui[locale].newTab} />
                        <HoverUnderline className='max-[920px]:hidden' />
                      </span>
                    </span>
                    <span aria-hidden className='text-muted-foreground'>
                      ↗
                    </span>
                  </a>
                </m.li>
              );
            })}
          </m.ul>
        </div>
        <m.div
          initial='hidden'
          whileInView='show'
          viewport={inView}
          variants={delayed(variants.fromRight, 0.15)}
          className='flex min-[920px]:flex-[1.3_1_440px]'>
          <SurfaceCard className='flex-1 p-5 min-[920px]:rounded-2xl min-[920px]:p-8'>
            <ContactForm locale={locale} copy={copy.form} />
          </SurfaceCard>
        </m.div>
      </div>
    </Section>
  );
};

export default Contact;
