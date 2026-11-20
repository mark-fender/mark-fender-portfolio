import * as m from 'motion/react-client';
import RevealHeading from '@/components/motion/RevealHeading';
import Section from '@/components/section/Section';
import { sectionHeader } from '@/content/nav';
import { skillGroups } from '@/content/skills';
import { ui } from '@/content/ui';
import { duration, ease } from '@/design-system/motion';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { skillIcons } from './icons';
import SkillsGraph from './SkillsGraph';

const chip = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: duration.slow, ease: ease.out } },
} as const;

const SkillsSection = ({ locale }: { locale: Locale }) => (
  <Section id='skills' {...sectionHeader('skills', locale)}>
    <RevealHeading className='mb-10 text-section' text={ui[locale].skills.heading} />
    <SkillsGraph
      groups={skillGroups.map(({ id, name, items }) => ({
        id,
        name: name[locale],
        chips: (
          <ul
            aria-labelledby={`skills-${id}`}
            className={cn(
              'flex flex-wrap items-start gap-2.5 text-body leading-none font-medium',
              id === 'tooling' && '@min-[860px]:flex-col',
            )}>
            {items.map((item) => {
              const Icon = skillIcons[item];
              return (
                <m.li
                  key={item}
                  variants={chip}
                  className='pill flex items-center gap-2.25 py-2.25 pr-4 pl-3 whitespace-nowrap'>
                  <Icon aria-hidden className='size-[1.05em] shrink-0 text-muted-foreground' />
                  {item}
                </m.li>
              );
            })}
          </ul>
        ),
      }))}
    />
  </Section>
);

export default SkillsSection;
