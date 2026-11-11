import SectionRule from '@/components/SectionRule';
import SurfaceCard from '@/components/SurfaceCard';
import { skillGroups } from '@/lib/data';
import { cn } from '@/lib/utils';

const total = skillGroups.reduce((sum, g) => sum + g.items.length, 0);
const pad = (n: number) => String(n).padStart(2, '0');

const Skills = () => (
  <section id='skills' className='page-container pt-18 pb-0 min-[920px]:pt-10 min-[920px]:pb-34'>
    <div className='mb-3 min-[920px]:mb-6'>
      <SectionRule id='skills' />
    </div>
    <div className='mb-5.5 flex flex-wrap items-end justify-between gap-6 min-[920px]:mb-10'>
      <h2 className='text-section'>My skills</h2>
      <span className='font-mono text-label text-muted-foreground max-[920px]:hidden'>
        {total} technologies · {skillGroups.length} groups
      </span>
    </div>
    <div className='flex flex-wrap gap-3 min-[920px]:gap-4'>
      {skillGroups.map((group) => (
        <SurfaceCard
          key={group.name}
          interactive
          className={cn(
            'flex min-w-0 flex-col gap-3.5 p-4.5 min-[920px]:gap-5 min-[920px]:p-6',
            'wide' in group ? 'flex-[2_1_620px]' : 'flex-[1_1_300px]',
          )}>
          <header className='flex items-baseline justify-between gap-3'>
            <h3 className='text-base font-semibold tracking-[-0.01em] min-[920px]:text-lg'>
              {group.name}
            </h3>
            <span className='font-mono text-caption text-muted-foreground transition-colors duration-240 group-hover/card:text-foreground'>
              {pad(group.items.length)}
            </span>
          </header>
          <ul className='grid grid-cols-2 gap-1.5 min-[920px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] min-[920px]:gap-2'>
            {group.items.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className='flex min-w-0 items-center gap-2.5 rounded-[10px] bg-surface-raised px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-240 group-hover/card:bg-card min-[920px]:gap-3 min-[920px]:rounded-md min-[920px]:px-3.5 min-[920px]:py-3 min-[920px]:text-[15px]'>
                <Icon aria-hidden className='size-4.5 shrink-0 min-[920px]:size-5.5' />
                <span className='text-foreground max-[920px]:truncate'>{name}</span>
              </li>
            ))}
          </ul>
        </SurfaceCard>
      ))}
    </div>
  </section>
);

export default Skills;
