import { useId, type ComponentProps } from 'react';
import { cn, lightStyle } from '@/lib/utils';

type Props = ComponentProps<'div'> & { interactive?: boolean };

const SurfaceCard = ({ interactive, className, style, ...props }: Props) => {
  const light = lightStyle(useId());
  return (
    <div
      style={{ ...light, ...style }}
      className={cn(
        'group/card glass relative rounded-xl bg-card',
        interactive &&
          'glass-hover transition-[translate,background-color] duration-base ease-out-strong hover:-translate-y-0.75 hover:bg-surface-raised',
        className,
      )}
      {...props}
    />
  );
};

export default SurfaceCard;
