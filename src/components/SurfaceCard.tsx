import { useId, type ComponentProps } from 'react';
import { cn, lightStyle } from '@/lib/utils';

type Props = ComponentProps<'div'> & { interactive?: boolean };

// The only card hover implementation. Children react via group-hover/card:, never their own hover:.
// Each card is lit from its own angle, seeded by useId so server and client agree.
const SurfaceCard = ({ interactive, className, style, ...props }: Props) => {
  const light = lightStyle(useId());
  return (
    <div
      style={{ ...light, ...style }}
      className={cn(
        'group/card glass relative rounded-xl bg-card',
        interactive &&
          'glass-hover transition-[translate,background-color] duration-240 ease-out-strong hover:-translate-y-0.75 hover:bg-surface-raised',
        className,
      )}
      {...props}
    />
  );
};

export default SurfaceCard;
