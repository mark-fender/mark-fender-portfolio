import HoverUnderline from '@/components/HoverUnderline';
import Section from '@/components/section/Section';
import SurfaceCard from '@/components/SurfaceCard';
import { sectionHeader } from '@/content/nav';
import { socials } from '@/content/site';
import { ui } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import ContactForm from './ContactForm';
import { socialIcons } from './icons';

const Contact = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].contact;
  return (
    <Section id='contact' {...sectionHeader('contact', locale)}>
      <h2 className='mb-8 max-w-225 text-statement min-[920px]:mb-14'>{copy.heading}</h2>
      <div className='flex flex-col gap-4.5 min-[920px]:flex-row min-[920px]:flex-wrap min-[920px]:gap-12'>
        <div className='contents min-[920px]:flex min-[920px]:flex-[1_1_340px] min-[920px]:flex-col min-[920px]:justify-between min-[920px]:gap-10'>
          <p className='text-lead text-muted-foreground min-[920px]:max-w-105'>{copy.intro}</p>
          <ul className='border-b border-border max-[920px]:order-1 max-[920px]:mt-6 min-[920px]:max-w-105'>
            {socials.map(({ label, href }) => {
              const Icon = socialIcons[label];
              return (
                <li key={label} className='border-t border-border'>
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex items-center justify-between py-3.5 text-[15px] min-[920px]:py-4 min-[920px]:text-base'>
                    <span className='flex items-center gap-3'>
                      <Icon aria-hidden className='size-[1.1em] shrink-0 text-muted-foreground' />
                      <span className='flex flex-col gap-0.75'>
                        {label}
                        <HoverUnderline className='max-[920px]:hidden' />
                      </span>
                    </span>
                    <span aria-hidden className='text-muted-foreground'>
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <SurfaceCard className='p-5 min-[920px]:flex-[1.3_1_440px] min-[920px]:rounded-2xl min-[920px]:p-8'>
          <ContactForm locale={locale} copy={copy.form} />
        </SurfaceCard>
      </div>
    </Section>
  );
};

export default Contact;
