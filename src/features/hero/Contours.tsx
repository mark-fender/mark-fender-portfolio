import { CONTOUR_DRAW_STAGGER } from '@/design-system/motion';
import { CONTOUR_PATHS, FIELD_VIEWBOX } from './field';

// Reduced motion: no animation at all (the tokens.css reset keeps delays, so the rings would
// sit mid-delay). Paths then render fully drawn.
// Match --animate-contour-draw (2.8s) and the -1s breathe stagger (1/8 of the 8s breathe).
const DRAW_S = 2.8;
const BREATHE_STAGGER_S = 1;

const Contours = () => (
  <svg
    data-contours
    viewBox={FIELD_VIEWBOX}
    fill='none'
    stroke='currentColor'
    strokeWidth={1.2}
    className='size-full origin-[60%_45%] animate-contour-sway overflow-visible text-border motion-reduce:animate-none'>
    {CONTOUR_PATHS.map((d, i) => (
      <g
        key={d}
        className='origin-center animate-contour-breathe [animation-fill-mode:backwards] transform-fill motion-reduce:animate-none'
        style={{ animationDelay: `${DRAW_S - i * BREATHE_STAGGER_S}s` }}>
        <path
          d={d}
          pathLength={1}
          strokeDasharray={1}
          className='animate-contour-draw motion-reduce:animate-none'
          style={{ animationDelay: `${i * CONTOUR_DRAW_STAGGER}s` }}
        />
      </g>
    ))}
  </svg>
);

export default Contours;
