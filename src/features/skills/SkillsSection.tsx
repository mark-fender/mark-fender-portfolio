import type { ReactNode } from 'react';
import Section from '@/components/section/Section';
import { sectionHeader } from '@/content/nav';
import { skillGroups, type SkillGroupId } from '@/content/skills';
import { ui } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { skillIcons } from './icons';

// Connectors span the grid gap exactly, so the gap lives in one variable on the grid.
// Each ends in a node on both card edges. They sit behind the cards (the grid is isolated, so
// -z-10 never drops below the page), so each card hides the inner half of its node.
const node =
  'before:absolute before:size-[7px] before:rounded-full before:border before:border-input before:bg-background after:absolute after:size-[7px] after:rounded-full after:border after:border-input after:bg-background';

const Down = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'absolute top-full left-1/2 -z-10 h-(--skills-gap) w-px bg-input',
      node,
      'before:-top-[3.5px] before:-left-[3px] after:-bottom-[3.5px] after:-left-[3px]',
      className,
    )}
  />
);

const ToRail = () => (
  <span
    aria-hidden
    className={cn(
      'absolute top-1/2 left-full -z-10 hidden w-(--skills-gap) border-t border-dashed border-input @min-[860px]:block',
      node,
      'before:-top-[4px] before:-left-[3.5px] after:-top-[4px] after:-right-[3.5px]',
    )}
  />
);

const place: Record<SkillGroupId, { className: string; extra?: ReactNode }> = {
  state: {
    className: 'order-1 @min-[860px]:col-start-1 @min-[860px]:row-start-1',
    extra: <Down />,
  },
  styling: {
    className: 'order-2 @min-[860px]:col-start-2 @min-[860px]:row-start-1',
    extra: (
      <>
        <Down />
        <ToRail />
      </>
    ),
  },
  frameworks: {
    className: 'order-3 @min-[860px]:col-span-2 @min-[860px]:col-start-1 @min-[860px]:row-start-2',
    extra: (
      <>
        <Down />
        <ToRail />
      </>
    ),
  },
  languages: {
    className: 'order-4 @min-[860px]:col-span-2 @min-[860px]:col-start-1 @min-[860px]:row-start-3',
    extra: (
      <>
        <Down className='@min-[860px]:hidden' />
        <ToRail />
      </>
    ),
  },
  tooling: {
    className:
      'order-5 border-dashed border-input bg-background @min-[860px]:col-start-3 @min-[860px]:row-span-3 @min-[860px]:row-start-1',
  },
};

const SkillsSection = ({ locale }: { locale: Locale }) => (
  <Section id='skills' {...sectionHeader('skills', locale)}>
    <h2 className='mb-10 text-section'>{ui[locale].skills.heading}</h2>
    <div className='@container'>
      <dl className='isolate grid grid-cols-1 gap-(--skills-gap) [--skills-gap:--spacing(8)] @min-[860px]:grid-cols-[1.5fr_1fr_minmax(13rem,0.6fr)]'>
        {skillGroups.map(({ id, name, items }) => {
          const { className, extra } = place[id];
          return (
            <div
              key={id}
              className={cn(
                'relative flex flex-col gap-4 rounded-[14px] border border-border bg-card px-5 pt-4.5 pb-5.5 @min-[860px]:px-7 @min-[860px]:pt-5.5 @min-[860px]:pb-7',
                className,
              )}>
              <dt className='font-mono text-caption text-muted-foreground'>{name[locale]}</dt>
              <dd>
                <ul
                  className={cn(
                    'flex flex-wrap items-start gap-2.5 text-[clamp(1rem,1.25vw,1.125rem)] leading-none font-medium tracking-[-0.01em]',
                    id === 'tooling' && '@min-[860px]:flex-col',
                  )}>
                  {items.map((item) => {
                    const Icon = skillIcons[item];
                    return (
                      <li
                        key={item}
                        className='pill flex items-center gap-2.25 py-2.25 pr-4 pl-3 whitespace-nowrap'>
                        <Icon
                          aria-hidden
                          className='size-[1.05em] shrink-0 text-muted-foreground'
                        />
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </dd>
              {extra}
            </div>
          );
        })}
      </dl>
    </div>
  </Section>
);

export default SkillsSection;
