import { Accordion as AccordionPrimitive } from 'radix-ui';
import ExperienceRail from '@/components/experience/ExperienceRail';
import SectionRule from '@/components/SectionRule';
import SurfaceCard from '@/components/SurfaceCard';
import ExperienceAccordion from '@/components/experience/ExperienceAccordion';
import { AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { experiencesData } from '@/lib/data';
import { formatRange, formatTenure } from '@/lib/time';
import { cn } from '@/lib/utils';

const firstYear = Math.min(...experiencesData.map((e) => e.from.year));
const companies = new Set(experiencesData.map((e) => e.company)).size;

const Experience = () => (
  <section
    id='experience'
    className='page-container pt-18 pb-0 min-[920px]:pt-10 min-[920px]:pb-34'>
    <div className='mb-4.5 min-[920px]:mb-6'>
      <SectionRule id='experience' />
    </div>
    <div className='flex flex-wrap gap-x-14 gap-y-6'>
      <div className='flex max-w-80 flex-[1_1_300px] flex-col gap-3.5 min-[920px]:gap-5'>
        <h2 className='text-section'>My experience</h2>
        <p className='font-mono text-label text-muted-foreground max-[920px]:hidden'>
          {firstYear} → today · {companies} companies
        </p>
        <p className='flex items-center gap-2 font-mono text-caption text-muted-foreground min-[920px]:mt-2 min-[920px]:gap-2.5'>
          <span aria-hidden className='size-2 rounded-full bg-primary min-[920px]:size-2.5' />
          Current role
        </p>
      </div>
      <div className='min-w-0 flex-[999_1_560px]'>
        <ExperienceAccordion>
          <ol className='flex flex-col gap-3.5'>
            {experiencesData.map((job, i) => {
              const current = job.to === null;
              return (
                <li
                  key={`${job.company}-${job.from.year}`}
                  className='relative pl-7.5 min-[920px]:pl-10'>
                  <ExperienceRail current={current} last={i === experiencesData.length - 1} />
                  <AccordionItem value={`item-${i}`} asChild className='border-0'>
                    <SurfaceCard
                      interactive
                      className='overflow-hidden rounded-2xl min-[920px]:rounded-[18px]'>
                      <AccordionPrimitive.Header asChild>
                        <h3>
                          <AccordionPrimitive.Trigger className='group relative flex w-full flex-wrap items-center gap-x-6 gap-y-2.5 px-4.5 py-4 text-left max-[920px]:gap-x-2.5 max-[920px]:pr-14 min-[920px]:px-6 min-[920px]:py-5.5'>
                            <span className='flex flex-[1_1_280px] flex-col gap-0.5 min-[920px]:gap-1'>
                              <span className='text-lg font-semibold min-[920px]:text-title'>
                                {job.title}
                              </span>
                              <span className='text-sm text-muted-foreground min-[920px]:text-[15px]'>
                                {job.company}
                              </span>
                            </span>
                            <span
                              className={cn(
                                'rounded-full border px-2.5 py-1.25 font-mono text-caption tabular-nums',
                                current
                                  ? 'border-primary text-primary'
                                  : 'border-input text-muted-foreground',
                              )}>
                              {formatRange(job.from, job.to)}
                            </span>
                            <span className='font-mono text-caption text-muted-foreground tabular-nums min-[920px]:min-w-23 min-[920px]:text-right'>
                              {formatTenure(job.from, job.to)}
                            </span>
                            <span
                              aria-hidden
                              className='inline-flex size-8 items-center justify-center rounded-full border border-input font-mono text-base text-foreground max-[920px]:absolute max-[920px]:top-4 max-[920px]:right-4'>
                              <span className='group-data-[state=open]:hidden'>+</span>
                              <span className='hidden group-data-[state=open]:inline'>-</span>
                            </span>
                          </AccordionPrimitive.Trigger>
                        </h3>
                      </AccordionPrimitive.Header>
                      {/* forceMount + hidden keeps every description in the HTML (SEO, find-in-page). */}
                      <AccordionContent
                        forceMount
                        className='max-w-180 px-4.5 pb-4.5 text-body text-muted-foreground min-[920px]:px-6 min-[920px]:pb-6'>
                        {job.description}
                      </AccordionContent>
                    </SurfaceCard>
                  </AccordionItem>
                </li>
              );
            })}
          </ol>
        </ExperienceAccordion>
      </div>
    </div>
  </section>
);

export default Experience;
