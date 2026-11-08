import { skillGroups } from '@/lib/data';

const names = skillGroups.flatMap((g) => g.items.map((s) => s.name));

// Each copy carries its own trailing gap (pr-10), so the -50% loop lands exactly on the second copy.
const Copy = ({ hidden }: { hidden?: boolean }) => (
  <ul aria-hidden={hidden || undefined} className='flex gap-10 pr-10'>
    {names.map((name) => (
      <li key={name} className='inline-flex items-center gap-10'>
        {name}
        <span className='size-[5px] rounded-full bg-accent-decorative' />
      </li>
    ))}
  </ul>
);

const Marquee = () => (
  <div className='overflow-hidden border-y border-border py-[18px]'>
    <div className='flex w-max animate-marquee font-mono text-sm whitespace-nowrap text-muted-foreground hover:[animation-play-state:paused]'>
      <Copy />
      <Copy hidden />
    </div>
  </div>
);

export default Marquee;
