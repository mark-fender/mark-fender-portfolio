import ContactForm from '@/components/contact/ContactForm';
import HoverUnderline from '@/components/HoverUnderline';
import SurfaceCard from '@/components/SurfaceCard';
import SectionRule from '@/components/SectionRule';
import { socialLinks } from '@/lib/data';

// Below 920px the left column dissolves (contents) so the links can follow the form.
const Contact = () => (
  <section id='contact' className='page-container pt-18 pb-18 min-[920px]:pt-10 min-[920px]:pb-34'>
    <div className='mb-4.5 min-[920px]:mb-6'>
      <SectionRule id='contact' />
    </div>
    <h2 className='mb-4.5 max-w-225 text-statement min-[920px]:mb-14'>
      Let&apos;s talk about possible <span className='text-primary'>collaboration</span>
    </h2>
    <div className='flex flex-col gap-4.5 min-[920px]:flex-row min-[920px]:flex-wrap min-[920px]:gap-12'>
      <div className='contents min-[920px]:flex min-[920px]:flex-[1_1_340px] min-[920px]:flex-col min-[920px]:justify-between min-[920px]:gap-10'>
        <p className='max-w-105 text-lead text-muted-foreground max-[920px]:hidden'>
          Ready to bring your ideas to life? I&apos;m here to help create amazing digital
          experiences.
        </p>
        <ul className='border-b border-border max-[920px]:order-1 min-[920px]:max-w-105'>
          {socialLinks.map(({ label, href }) => (
            <li key={label} className='border-t border-border'>
              <a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center justify-between py-3.5 text-[15px] min-[920px]:py-4 min-[920px]:text-base'>
                <span className='flex flex-col gap-0.75'>
                  {label}
                  <HoverUnderline className='max-[920px]:hidden' />
                </span>
                <span aria-hidden className='text-muted-foreground'>
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <SurfaceCard className='p-5 min-[920px]:flex-[1.3_1_440px] min-[920px]:rounded-2xl min-[920px]:p-8'>
        <ContactForm />
      </SurfaceCard>
    </div>
  </section>
);

export default Contact;
