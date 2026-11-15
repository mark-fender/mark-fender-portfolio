import { cn } from '@/lib/utils';

const NowDot = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn('size-1.75 animate-now-ring rounded-full bg-primary', className)}
  />
);

export default NowDot;
