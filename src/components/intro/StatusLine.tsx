import LocalTime from '@/components/LocalTime';
import { siteMeta } from '@/lib/data';

const StatusLine = () => (
  <dl className='relative z-10 mt-[30px] grid grid-cols-[84px_1fr] gap-y-1.5 font-mono text-caption text-muted-foreground min-[920px]:mt-18 min-[920px]:flex min-[920px]:flex-wrap min-[920px]:gap-x-10 min-[920px]:gap-y-3'>
    <div className='contents min-[920px]:flex min-[920px]:gap-2.5'>
      <dt>Local time</dt>
      <dd className='text-foreground'>
        <LocalTime timeZone={siteMeta.timeZone} />
      </dd>
    </div>
    <div className='contents min-[920px]:flex min-[920px]:gap-2.5'>
      <dt>Based in</dt>
      <dd className='text-foreground'>
        {siteMeta.city}, {siteMeta.country}
      </dd>
    </div>
    <div className='contents min-[920px]:flex min-[920px]:gap-2.5'>
      <dt>Currently</dt>
      <dd className='text-foreground'>{siteMeta.currentRole}</dd>
    </div>
  </dl>
);

export default StatusLine;
