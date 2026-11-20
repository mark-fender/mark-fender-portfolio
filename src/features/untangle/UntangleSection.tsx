import * as m from 'motion/react-client';
import RevealHeading from '@/components/motion/RevealHeading';
import Section from '@/components/section/Section';
import { sectionHeader } from '@/content/nav';
import { ui } from '@/content/ui';
import { delayed, inView, variants } from '@/design-system/motion';
import type { Locale } from '@/lib/i18n';
import Game from './Game';

const UntangleSection = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].game;
  return (
    <Section id='game' {...sectionHeader('game', locale)}>
      <Game locale={locale} copy={copy.board}>
        <RevealHeading className='text-section min-[920px]:col-start-1' text={copy.heading} />
        <m.p
          initial='hidden'
          whileInView='show'
          viewport={inView}
          variants={delayed(variants.fromLeft, 0.15)}
          className='text-body/[1.65] text-muted-foreground min-[920px]:col-start-1'>
          {copy.intro}
        </m.p>
      </Game>
    </Section>
  );
};

export default UntangleSection;
