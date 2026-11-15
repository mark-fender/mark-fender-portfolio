import NowDot from '@/components/NowDot';
import Section from '@/components/section/Section';
import TagList from '@/components/TagList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { roles } from '@/content/experience';
import { sectionHeader } from '@/content/nav';
import { ui } from '@/content/ui';
import { fill, plural, type Locale } from '@/lib/i18n';
import { lightStyle } from '@/lib/utils';
import { formatRange, formatTenure, monthsIn } from './duration';

const current = roles.find((role) => role.to === null)!;

const ExperienceSection = ({ locale }: { locale: Locale }) => {
  const copy = ui[locale].experience;
  return (
    <Section id='experience' {...sectionHeader('experience', locale)}>
      <div className='mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4'>
        <h2 className='text-section'>{copy.heading}</h2>
        <span className='font-mono text-label text-muted-foreground'>
          {fill(copy.summary, {
            year: roles[0]!.from.year,
            roles: plural(locale, roles.length, copy.roles),
          })}
        </span>
      </div>
      <Tabs defaultValue={current.company}>
        <TabsList aria-label={copy.tabs} className='flex items-stretch gap-1.5'>
          {roles.map((role) => (
            <TabsTrigger
              key={role.company}
              value={role.company}
              style={{ flex: `${monthsIn(role.from, role.to)} 1 44px` }}
              className='flex min-h-13 min-w-11 flex-col justify-between gap-2 overflow-hidden rounded-[14px] border border-border bg-card px-1.5 py-2 text-left transition-[background-color,border-color] duration-180 not-data-[state=active]:hover:border-input data-[state=active]:border-muted-foreground data-[state=active]:bg-surface-raised min-[820px]:min-h-21 min-[820px]:p-3'>
              <span
                aria-hidden
                className='flex flex-col items-start gap-1.5 font-mono text-[11px] whitespace-nowrap text-muted-foreground min-[820px]:flex-row min-[820px]:items-center min-[820px]:gap-2'>
                {role.from.year}
                {role === current && (
                  <NowDot className='shrink-0 max-[820px]:mr-0.5 max-[820px]:self-end' />
                )}
              </span>
              <span aria-hidden className='truncate text-sm font-medium max-[820px]:hidden'>
                {role.company}
              </span>
              <span className='sr-only'>
                {role.company}, {formatRange(role.from, role.to, locale)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {roles.map((role) => (
          <TabsContent
            key={role.company}
            value={role.company}
            forceMount
            style={lightStyle(role.company)}
            className='glass relative mt-6 flex flex-wrap gap-x-14 gap-y-6 rounded-2xl bg-card p-5 data-[state=inactive]:hidden min-[920px]:p-8'>
            <div className='flex max-w-75 flex-[1_1_240px] flex-col gap-2'>
              <h3 className='text-feature'>{role.company}</h3>
              <span className='text-muted-foreground'>{role.title}</span>
              <span className='mt-3 font-mono text-caption text-muted-foreground tabular-nums'>
                {formatRange(role.from, role.to, locale)}
              </span>
              <span className='font-mono text-caption text-muted-foreground tabular-nums'>
                {formatTenure(role.from, role.to, locale)}
              </span>
            </div>
            <div className='flex max-w-180 min-w-0 flex-[999_1_480px] flex-col gap-4 text-muted-foreground'>
              <p className='text-body'>{role.description[locale]}</p>
              {role.points && (
                <ul className='flex list-disc flex-col gap-2 pl-5 text-body/[1.6]'>
                  {role.points.map((point) => (
                    <li key={point.en}>{point[locale]}</li>
                  ))}
                </ul>
              )}
              {role.stack && <TagList tags={role.stack} />}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
};

export default ExperienceSection;
