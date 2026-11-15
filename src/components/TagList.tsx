import { cn } from '@/lib/utils';

const TagList = ({ tags, className }: { tags: readonly string[]; className?: string }) => (
  <ul
    className={cn('flex flex-wrap gap-1.5 font-mono text-[11px] text-muted-foreground', className)}>
    {tags.map((tag) => (
      <li
        key={tag}
        className='pill px-2.75 py-1.25 leading-none transition-colors duration-240 ease-out-strong group-hover/card:border-foreground/12 group-hover/card:text-foreground/85'>
        {tag}
      </li>
    ))}
  </ul>
);

export default TagList;
