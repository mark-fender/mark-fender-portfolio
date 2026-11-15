import SurfaceCard from '@/components/SurfaceCard';
import TagList from '@/components/TagList';
import type { Project } from '@/content/projects';
import { ui } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import Summary from './Summary';

const SummaryText = ({ summary, link }: { summary: string; link: Project['link'] }) => {
  const at = link ? summary.indexOf(link.label) : -1;
  if (!link || at < 0) return summary;
  return (
    <>
      {summary.slice(0, at)}
      <a
        href={link.href}
        target='_blank'
        rel='noopener noreferrer'
        className='font-medium text-primary underline decoration-1 underline-offset-4 hover:decoration-2'>
        {link.label}
      </a>
      {summary.slice(at + link.label.length)}
    </>
  );
};

type Props = { project: Project; locale: Locale };

const ProjectText = ({ project, locale, className }: Props & { className?: string }) => {
  const copy = ui[locale].projects;
  const label = [project.domain[locale], project.client, project.featured && copy.current];
  return (
    <div className={cn('flex min-w-0 flex-col gap-3.5', className)}>
      <div className='flex flex-col gap-3.5'>
        <span
          className={cn(
            'font-mono text-caption',
            project.featured ? 'text-primary' : 'text-muted-foreground',
          )}>
          {label.filter(Boolean).join(', ')}
        </span>
        <h3 className='text-feature'>{project.title}</h3>
      </div>
      <div className='flex flex-1 flex-col gap-3.5'>
        <Summary id={`project-${project.slug}`} readMore={copy.readMore} showLess={copy.showLess}>
          <SummaryText summary={project.summary[locale]} link={project.link} />
        </Summary>
        <TagList tags={project.tags} className='mt-auto' />
      </div>
    </div>
  );
};

const ProjectCard = ({ project, locale }: Props) => (
  <SurfaceCard interactive className='flex rounded-2xl shadow-card'>
    <ProjectText
      project={project}
      locale={locale}
      className='flex-1 p-5 min-[920px]:flex-row min-[920px]:gap-12 min-[920px]:p-8 min-[920px]:*:flex-1 min-[920px]:*:last:flex-2'
    />
  </SurfaceCard>
);

export default ProjectCard;
