import type { CSSProperties } from 'react';

// Fixed offsets keep server and client output identical. Clip here so invisible pieces
// cannot widen the page; the glass frame itself must remain unclipped.
const COLORS = ['bg-primary', 'bg-foreground', 'bg-primary', 'bg-muted-foreground'];
const PIECES = Array.from({ length: 40 }, (_, i) => {
  const angle = (i * 137.508 * Math.PI) / 180;
  const dist = 120 + ((i * 37) % 180);
  return {
    color: COLORS[i % COLORS.length],
    round: i % 3 === 0,
    style: {
      '--x': `${Math.round(Math.cos(angle) * dist)}px`,
      '--y': `${Math.round(Math.sin(angle) * dist * 0.6 - 40)}px`,
      '--fall': `${50 + ((i * 23) % 50)}px`,
      '--spin': `${((i * 71) % 360) - 180}deg`,
      animationDelay: `${(i % 4) * 25}ms`,
    } as CSSProperties,
  };
});

const Confetti = () => (
  <div
    aria-hidden
    className='pointer-events-none absolute inset-0 overflow-hidden rounded-2xl motion-reduce:hidden'>
    {PIECES.map(({ color, round, style }, i) => (
      <span
        key={i}
        style={style}
        className={`confetti absolute top-1/2 left-1/2 ${color} ${round ? 'size-1.5 rounded-full' : 'h-1 w-2 rounded-[1px]'}`}
      />
    ))}
  </div>
);

export default Confetti;
