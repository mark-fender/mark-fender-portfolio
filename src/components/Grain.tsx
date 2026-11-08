// Static film grain over the whole page. Never animated.
const Grain = () => (
  <svg
    aria-hidden
    className='pointer-events-none fixed inset-0 z-50 size-full opacity-[0.07] mix-blend-overlay light:opacity-5 light:mix-blend-multiply'>
    <filter id='grain'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves={2} stitchTiles='stitch' />
    </filter>
    <rect width='100%' height='100%' filter='url(#grain)' />
  </svg>
);

export default Grain;
