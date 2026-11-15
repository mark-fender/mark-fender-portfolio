import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import SectionHeader, { type SectionHeaderProps } from './SectionHeader';

type Props = SectionHeaderProps & { id: string; className?: string; children: ReactNode };

const Section = ({ id, className, children, ...header }: Props) => (
  <section
    id={id}
    className={cn('page-container pt-6 pb-18 min-[920px]:pt-10 min-[920px]:pb-34', className)}>
    <div className='mb-10 min-[920px]:mb-16'>
      <SectionHeader {...header} />
    </div>
    {children}
  </section>
);

export default Section;
