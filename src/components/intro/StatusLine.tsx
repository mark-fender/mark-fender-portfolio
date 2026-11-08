import LocalTime from '@/components/LocalTime';
import { siteMeta } from '@/lib/data';

const StatusLine = () => (
  <dl className='relative z-10 mt-18 flex flex-wrap gap-x-10 gap-y-3 font-mono text-caption text-muted-foreground'>
    <div className='flex gap-2.5'>
      <dt>Local time</dt>
      <dd className='text-foreground'>
        <LocalTime timeZone={siteMeta.timeZone} />
      </dd>
    </div>
    <div className='flex gap-2.5'>
      <dt>Based in</dt>
      <dd className='text-foreground'>
        {siteMeta.city}, {siteMeta.country}
      </dd>
    </div>
    <div className='flex gap-2.5'>
      <dt>Currently</dt>
      <dd className='text-foreground'>{siteMeta.currentRole}</dd>
    </div>
  </dl>
);

export default StatusLine;
