import type { PropsWithChildren } from 'react';

const SectionHeading = ({ children }: PropsWithChildren) => (
  <h2 className='section-heading'>{children}</h2>
);

export default SectionHeading;
