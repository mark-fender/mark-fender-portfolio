import Section from '@/components/section/Section';
import { sectionHeader } from '@/content/nav';
import { ui } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import Game from './Game';

const UntangleSection = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].game;
  return (
    <Section id='game' {...sectionHeader('game', locale)}>
      <Game locale={locale} copy={copy.board}>
        <h2 className='text-section min-[920px]:col-start-1'>{copy.heading}</h2>
        <p className='text-body/[1.65] text-muted-foreground min-[920px]:col-start-1'>
          {copy.intro}
        </p>
      </Game>
    </Section>
  );
};

export default UntangleSection;
