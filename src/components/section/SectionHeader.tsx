import * as m from 'motion/react-client';
import { ease, RULE_DRAW_S } from '@/design-system/motion';

export type SectionHeaderProps = { index: number; label: string; total: number };

const pad = (n: number) => String(n).padStart(2, '0');

// The section's h2 already provides its accessible name.
const SectionHeader = ({ index, label, total }: SectionHeaderProps) => (
  <div aria-hidden className='flex items-center gap-4 font-mono text-caption text-muted-foreground'>
    <span>{pad(index)}</span>
    <span>{label}</span>
    <m.span
      className='h-px flex-1 origin-left bg-border'
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: RULE_DRAW_S, ease: ease.out }}
    />
    <span className='tabular-nums'>
      {pad(index)} / {pad(total)}
    </span>
  </div>
);

export default SectionHeader;
