import HoverUnderline from '@/components/HoverUnderline';
import LocalTime from '@/components/LocalTime';
import { siteMeta } from '@/lib/data';

const NAME = 'Marek Lipčák';

const Footer = () => (
  <footer className='mt-auto overflow-hidden border-t border-border'>
    <div className='page-container flex flex-wrap justify-between gap-4 pt-6 pb-5 font-mono text-[11px] text-muted-foreground min-[920px]:pt-10 min-[920px]:pb-8 min-[920px]:text-[13px]'>
      <span>
        © {new Date().getFullYear()} {NAME}
      </span>
      <span>
        <span className='max-[920px]:hidden'>{siteMeta.city} · </span>
        <LocalTime timeZone={siteMeta.timeZone} />
      </span>
      <a href='#home' className='group flex flex-col gap-[3px]'>
        Back to top ↑
        <HoverUnderline />
      </a>
    </div>
    <div
      aria-hidden
      className='h-[0.78em] overflow-hidden text-center text-[clamp(64px,13.5vw,196px)] leading-none'>
      <span className='block font-semibold tracking-[-0.055em] whitespace-nowrap text-subtle-foreground'>
        {NAME}
      </span>
    </div>
  </footer>
);

export default Footer;
