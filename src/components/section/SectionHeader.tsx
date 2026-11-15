import * as m from 'motion/react-client';
import { ease } from '@/design-system/motion';

export type SectionHeaderProps = { index: number; label: string; total: number };

const pad = (n: number) => String(n).padStart(2, '0');

const SectionHeader = ({ index, label, total }: SectionHeaderProps) => (
  <div className='flex items-center gap-4 font-mono text-caption text-muted-foreground'>
    <span>{pad(index)}</span>
    <span>{label}</span>
    <m.span
      className='h-px flex-1 origin-left bg-border'
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: ease.out }}
    />
    <span className='tabular-nums'>
      {pad(index)} / {pad(total)}
    </span>
  </div>
);

export default SectionHeader;
