import * as React from 'react';
import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex w-full resize-none rounded-md border border-input bg-background px-4 py-3.5 text-base transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-2 aria-invalid:border-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
