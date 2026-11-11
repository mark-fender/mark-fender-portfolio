import { ImageIcon } from 'lucide-react';
import SurfaceCard from '@/components/SurfaceCard';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/data';

type Props = Project & { index: number; total: number };

const pad = (n: number) => String(n).padStart(2, '0');

const ProjectCard = ({ title, description, tags, url, index, total }: Props) => (
  <SurfaceCard
    interactive
    className='flex flex-col gap-4 rounded-2xl p-4.5 shadow-card min-[920px]:flex-row min-[920px]:flex-wrap min-[920px]:gap-10 min-[920px]:p-8'>
    <div className='flex min-w-0 flex-col gap-2.5 min-[920px]:flex-[1_1_380px] min-[920px]:gap-5'>
      <span className='font-mono text-label text-muted-foreground'>
        <span className='text-primary'>{pad(index + 1)}</span> / {pad(total)}
      </span>
      <h3 className='text-feature'>{title}</h3>
      <p className='text-sm/[1.65] text-muted-foreground min-[920px]:text-body'>{description}</p>
      <ul className='flex flex-wrap gap-1.5'>
        {tags.map((tag) => (
          <li
            key={tag}
            className='rounded-lg border border-border px-2.25 py-1.25 font-mono text-[11px] text-muted-foreground'>
            {tag}
          </li>
        ))}
      </ul>
      {url && (
        <Button asChild variant='outline' className='mt-auto self-start rounded-full'>
          <a href={url} target='_blank' rel='noopener noreferrer'>
            Live preview ↗
          </a>
        </Button>
      )}
    </div>
    <div className='min-w-0 overflow-hidden rounded-lg border border-border bg-background max-[920px]:order-first min-[920px]:flex-[1.3_1_420px]'>
      <div className='flex items-center gap-1.5 border-b border-border bg-surface-raised px-3.5 py-2.5 max-[920px]:hidden'>
        <span className='size-2.25 rounded-full bg-subtle-foreground' />
        <span className='size-2.25 rounded-full bg-subtle-foreground' />
        <span className='size-2.25 rounded-full bg-subtle-foreground' />
        {url && (
          <span className='ml-3 flex-1 truncate rounded-[6px] bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground'>
            {new URL(url).host}
          </span>
        )}
      </div>
      <div className='flex aspect-[16/10] items-center justify-center gap-2.5 text-muted-foreground'>
        <ImageIcon className='size-5.5' strokeWidth={1.5} aria-hidden />
        <span className='font-mono text-caption'>[Project screenshot]</span>
      </div>
    </div>
  </SurfaceCard>
);

export default ProjectCard;
