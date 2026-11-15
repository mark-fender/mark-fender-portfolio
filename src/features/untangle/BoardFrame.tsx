import type { ReactNode } from 'react';
import { cn, lightStyle } from '@/lib/utils';

const BoardFrame = ({ solved, children }: { solved?: boolean; children?: ReactNode }) => (
  <div
    style={lightStyle('board')}
    className={cn(
      'glass relative self-start rounded-2xl bg-card p-2 min-[920px]:col-start-2 min-[920px]:row-span-6 min-[920px]:row-start-1 min-[920px]:p-3',
      // Glass draws the edge, so the solved color goes to --glass-edge (it transitions there).
      solved && '[--glass-edge:var(--primary)]',
    )}>
    {children ?? <div className='aspect-100/60 rounded-[14px] bg-background' />}
  </div>
);

export default BoardFrame;
