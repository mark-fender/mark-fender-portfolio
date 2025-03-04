import { ReactNode } from 'react';

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className='section-heading'>{children}</h2>
);

export default SectionHeading;
