import SectionRule from '@/components/SectionRule';
import SurfaceCard from '@/components/SurfaceCard';
import { nowItems, sections } from '@/lib/data';

const title = sections.find((s) => s.id === 'off-the-clock')!.label;
const EQ_DELAYS = ['0s', '-0.4s', '-0.8s'];

const Equaliser = () => (
  <span aria-hidden className='inline-flex h-3 items-end gap-0.5'>
    {EQ_DELAYS.map((delay) => (
      <span
        key={delay}
        style={{ animationDelay: delay }}
        className='h-3 w-0.75 origin-bottom animate-eq rounded-[1px] bg-muted-foreground'
      />
    ))}
  </span>
);

const OffTheClock = () => (
  <section
    id='off-the-clock'
    className='page-container pt-18 pb-0 min-[920px]:pt-10 min-[920px]:pb-34'>
    <div className='mb-3.5 min-[920px]:mb-6'>
      <SectionRule id='off-the-clock' />
    </div>
    <div className='mb-3.5 flex max-w-140 flex-col gap-3.5 min-[920px]:mb-10 min-[920px]:gap-5'>
      <h2 className='text-section'>{title}</h2>
      <p className='text-[17px]/[1.6] text-muted-foreground'>
        [Short intro placeholder — what you do and think about when you&apos;re not shipping.]
      </p>
    </div>
    <div className='flex flex-wrap gap-3.5 min-[920px]:gap-4'>
      <SurfaceCard
        interactive
        className='flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 p-4.5 min-[920px]:gap-5 min-[920px]:p-6'>
        <header className='flex items-baseline justify-between gap-3'>
          <h3 className='text-base font-semibold tracking-[-0.01em] min-[920px]:text-lg'>Now</h3>
          <span className='font-mono text-caption text-muted-foreground'>[Updated month]</span>
        </header>
        <dl className='flex flex-col'>
          {nowItems.map(({ label, value }) => (
            <div
              key={label}
              className='grid grid-cols-[80px_1fr] gap-3 border-t border-border py-2.5 last:pb-0 min-[920px]:grid-cols-[88px_1fr] min-[920px]:py-3.5'>
              <dt className='pt-0.5 font-mono text-caption text-muted-foreground'>{label}</dt>
              <dd className='flex items-center gap-2.5 text-sm/normal min-[920px]:text-[15px]'>
                {label === 'Listening' && <Equaliser />}
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </SurfaceCard>
      <div className='flex min-w-0 flex-[2_1_620px] gap-2.5 overflow-x-auto max-[920px]:snap-x max-[920px]:snap-mandatory min-[920px]:grid min-[920px]:grid-cols-3 min-[920px]:gap-4 min-[920px]:overflow-visible'>
        {['01', '02', '03'].map((n) => (
          <SurfaceCard
            key={n}
            interactive
            className='flex min-h-55 w-[70%] shrink-0 snap-start items-center justify-center overflow-hidden rounded-xl bg-surface-raised min-[920px]:min-h-85 min-[920px]:w-auto'>
            <span className='font-mono text-caption text-muted-foreground'>[Photo {n}]</span>
            <span className='absolute bottom-3 left-3 rounded-lg bg-background px-2.25 py-1.25 font-mono text-[11px] text-muted-foreground'>
              [Place · season]
            </span>
          </SurfaceCard>
        ))}
      </div>
    </div>
  </section>
);

export default OffTheClock;
