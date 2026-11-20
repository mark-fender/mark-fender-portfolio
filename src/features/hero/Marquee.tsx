import { skillGroups } from '@/content/skills';

const names = skillGroups.flatMap((g) => g.items);

// Each copy carries its own trailing gap (pr-10), so the -50% loop lands exactly on the second copy.
const Copy = () => (
  <ul className='flex gap-10 pr-10'>
    {names.map((name) => (
      <li key={name} className='inline-flex items-center gap-10'>
        {name}
        <span className='size-1.25 rounded-full bg-accent-decorative' />
      </li>
    ))}
  </ul>
);

// The Skills section already exposes these names to assistive tech.
const Marquee = () => (
  <div
    aria-hidden
    className='mb-12 animate-fade-in overflow-hidden border-y border-border py-4.5 [animation-delay:0.7s] motion-reduce:animate-none min-[920px]:mb-24'>
    <div className='flex w-max animate-marquee font-mono text-label whitespace-nowrap text-muted-foreground hover:[animation-play-state:paused]'>
      <Copy />
      <Copy />
    </div>
  </div>
);

export default Marquee;
