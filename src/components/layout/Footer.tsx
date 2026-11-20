import HoverUnderline from '@/components/HoverUnderline';
import LocalTime from '@/components/LocalTime';
import type { Locale } from '@/lib/i18n';
import { lightStyle } from '@/lib/utils';

type Props = { name: string; city: string; timeZone: string; locale: Locale; backToTop: string };

const Footer = ({ name, city, timeZone, locale, backToTop }: Props) => (
  <footer className='mt-auto overflow-hidden border-t border-border'>
    <div className='page-container grid grid-cols-3 items-start gap-4 pt-6 pb-5 font-mono text-caption text-muted-foreground min-[920px]:pt-10 min-[920px]:pb-8 min-[920px]:text-label'>
      <span>
        © {new Date().getFullYear()} {name}
      </span>
      <span className='justify-self-center text-center'>
        <span className='max-[920px]:hidden'>{city}, </span>
        <LocalTime timeZone={timeZone} locale={locale} />
      </span>
      <a href='#home' className='group flex flex-col gap-0.75 justify-self-end text-right'>
        <span>
          {backToTop} <span aria-hidden>↑</span>
        </span>
        <HoverUnderline />
      </a>
    </div>
    <div
      aria-hidden
      className='h-[0.78em] overflow-hidden text-center text-[clamp(64px,13.5vw,196px)] leading-none'>
      <span
        style={lightStyle('footer-wordmark')}
        className='glass-text block font-semibold tracking-[-0.025em] whitespace-nowrap'>
        {name}
      </span>
    </div>
  </footer>
);

export default Footer;
