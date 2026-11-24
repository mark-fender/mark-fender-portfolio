import * as m from 'motion/react-client';
import RevealHeading from '@/components/motion/RevealHeading';
import Section from '@/components/section/Section';
import SurfaceCard from '@/components/SurfaceCard';
import { visited } from '@/content/travel';
import { ui } from '@/content/ui';
import { delayed, inView, variants } from '@/design-system/motion';
import { fill, type Locale } from '@/lib/i18n';
import Globe from './Globe';
import { placeName } from './names';

const TravelSection = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].travel;
  const visitedList = new Intl.ListFormat(locale).format(
    visited.map((code) => placeName(code, locale)),
  );
  return (
    <Section id='travel'>
      <SurfaceCard className='grid gap-4 rounded-2xl p-[clamp(1.25rem,3vw,2.5rem)] min-[920px]:grid-cols-[minmax(260px,392px)_minmax(0,1fr)] min-[920px]:grid-rows-[auto_auto_1fr] min-[920px]:gap-x-12 min-[920px]:gap-y-6'>
        <RevealHeading className='text-section min-[920px]:col-span-2' text={copy.heading} />
        <div className='flex flex-col gap-4 min-[920px]:col-start-1 min-[920px]:row-start-2'>
          <m.p
            initial='hidden'
            whileInView='show'
            viewport={inView}
            variants={delayed(variants.rise, 0.2)}
            className='max-w-98 text-body/[1.6] text-muted-foreground'>
            <span className='block min-[920px]:whitespace-nowrap'>{copy.highlighted}</span>{' '}
            <span className='block'>{copy.drag}</span>
          </m.p>
          <p className='sr-only'>{fill(copy.visitedList, { list: visitedList })}</p>
        </div>
        <Globe visited={visited} locale={locale} copy={copy.globe} />
      </SurfaceCard>
    </Section>
  );
};

export default TravelSection;
