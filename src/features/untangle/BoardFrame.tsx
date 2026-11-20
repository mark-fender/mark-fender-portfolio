import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { duration, ease } from '@/design-system/motion';
import { cn, lightStyle } from '@/lib/utils';

type Props = { solved?: boolean; shown?: boolean; children?: ReactNode };

const HIDDEN = { opacity: 0, y: 32, scale: 0.96 };

// A board loaded after its placeholder arrives must not repeat the entrance.
const BoardFrame = ({ solved, shown = false, children }: Props) => {
  const [from] = useState(() => (shown ? false : HIDDEN));
  return (
    <motion.div
      initial={from}
      animate={shown ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: duration.reveal, ease: ease.out, delay: 0.1 }}
      style={lightStyle('board')}
      className={cn(
        'glass relative self-start rounded-2xl bg-card p-2 min-[920px]:col-start-2 min-[920px]:row-span-6 min-[920px]:row-start-1 min-[920px]:p-3',
        // Glass draws the edge, so the solved color goes to --glass-edge (it transitions there).
        solved && '[--glass-edge:var(--primary)]',
      )}>
      {children ?? <div className='aspect-100/60 rounded-tile bg-background' />}
    </motion.div>
  );
};

export default BoardFrame;
