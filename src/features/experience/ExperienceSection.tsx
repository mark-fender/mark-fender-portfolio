import * as m from 'motion/react-client';
import { Fragment } from 'react';
import RevealHeading from '@/components/motion/RevealHeading';
import Section from '@/components/section/Section';
import TagList from '@/components/TagList';
import { roles } from '@/content/experience';
import { sectionHeader } from '@/content/nav';
import { ui } from '@/content/ui';
import { variants } from '@/design-system/motion';
import { type Locale } from '@/lib/i18n';
import { formatRange, formatTenure, monthsIn } from './duration';
import ExperienceTimeline from './ExperienceTimeline';

const ExperienceSection = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].experience;

  const panels = roles.map((role) => (
    <Fragment key={role.company}>
      <div className='flex max-w-75 flex-[1_1_240px] flex-col gap-2'>
        <m.h3 variants={variants.item} className='text-feature'>
          {role.company}
        </m.h3>
        <m.span variants={variants.item} className='text-muted-foreground'>
          {role.title}
        </m.span>
        <m.span
          variants={variants.item}
          className='mt-3 font-mono text-caption text-muted-foreground tabular-nums'>
          {formatRange(role.from, role.to, locale)}
        </m.span>
        <m.span
          variants={variants.item}
          className='font-mono text-caption text-muted-foreground tabular-nums'>
          {formatTenure(role.from, role.to, locale)}
        </m.span>
      </div>
      <div className='flex max-w-measure min-w-0 flex-[999_1_480px] flex-col gap-4 text-muted-foreground'>
        <m.p variants={variants.item} className='text-body'>
          {role.description[locale]}
        </m.p>
        {role.points && (
          <ul className='flex list-disc flex-col gap-2 pl-5 text-body/[1.6]'>
            {role.points.map((point) => (
              <m.li key={point.en} variants={variants.item}>
                {point[locale]}
              </m.li>
            ))}
          </ul>
        )}
        {role.stack && (
          <m.div variants={variants.item}>
            <TagList tags={role.stack} />
          </m.div>
        )}
      </div>
    </Fragment>
  ));

  return (
    <Section id='experience' {...sectionHeader('experience', locale)}>
      <RevealHeading className='mb-10 text-section' text={copy.heading} />
      <ExperienceTimeline
        label={copy.tabs}
        roles={roles.map((role) => ({
          company: role.company,
          year: role.from.year,
          months: monthsIn(role.from, role.to),
          current: role.to === null,
          range: formatRange(role.from, role.to, locale),
        }))}
        panels={panels}
      />
    </Section>
  );
};

export default ExperienceSection;
