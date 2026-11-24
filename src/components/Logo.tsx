import type { SVGProps } from 'react';

// Shared with the OG image, which can't read CSS and fills the path itself.
export const LOGO_VIEWBOX = '0 0 731 369';
export const LOGO_PATH =
  'M0 369 259 76 343 187 474 0 731 369H483L441 307H600L483 137 359 312 269 191 128 369Z';

// The mountain M. Fills with currentColor, so colour comes from a text-* class.
const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox={LOGO_VIEWBOX}
    fill='currentColor'
    aria-hidden='true'
    {...props}>
    <path d={LOGO_PATH} />
  </svg>
);

export default Logo;
