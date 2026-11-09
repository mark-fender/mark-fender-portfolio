import { cn } from '@/lib/utils';

// Link underline that draws in from the left while the parent `group` is hovered.
const HoverUnderline = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'h-px origin-left scale-x-0 bg-current transition-transform duration-240 ease-out-strong group-hover:scale-x-100',
      className,
    )}
  />
);

export default HoverUnderline;
