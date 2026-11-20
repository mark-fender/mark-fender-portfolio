import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import SectionHeader, { type SectionHeaderProps } from './SectionHeader';

type Props = SectionHeaderProps & { id: string; className?: string; children: ReactNode };

const Section = ({ id, className, children, ...header }: Props) => (
  <section id={id} className={cn('page-container pt-section-top pb-section', className)}>
    <div className='mb-section-head'>
      <SectionHeader {...header} />
    </div>
    {children}
  </section>
);

export default Section;
