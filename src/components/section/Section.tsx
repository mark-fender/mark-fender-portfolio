import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import SectionHeader from './SectionHeader';

type Props = { id: string; className?: string; children: ReactNode };

const Section = ({ id, className, children }: Props) => (
  <section id={id} className={cn('page-container pt-section-top pb-section', className)}>
    <div className='mb-section-head'>
      <SectionHeader />
    </div>
    {children}
  </section>
);

export default Section;
