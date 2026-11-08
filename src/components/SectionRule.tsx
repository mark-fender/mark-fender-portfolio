import * as m from 'motion/react-client';
import { ease } from '@/design-system/motion';
import { sections } from '@/lib/data';

const pad = (n: number) => String(n).padStart(2, '0');

const SectionRule = ({ id }: { id: (typeof sections)[number]['id'] }) => {
  const section = sections.find((s) => s.id === id);
  // A typo must fail the build, not render a wrong index.
  if (!section) throw new Error(`SectionRule: unknown section id "${id}"`);
  const index = pad(sections.indexOf(section) + 1);

  return (
    <div className='flex items-center gap-4 font-mono text-caption text-muted-foreground'>
      <span>
        {index} · {section.label}
      </span>
      <m.span
        className='h-px flex-1 origin-left bg-border'
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: ease.out }}
      />
      <span className='tabular-nums'>
        {index} / {pad(sections.length)}
      </span>
    </div>
  );
};

export default SectionRule;
