import SectionHeading from '@/components/SectionHeading';
import { experiencesData } from '@/lib/data';
import TimelineItem from '@/components/experience/TimelineItem';

const Experience = () => (
  <section id='experience'>
    <SectionHeading>My Experience</SectionHeading>
    <div className='relative w-[75%] mx-auto'>
      <div className='absolute left-2 top-0 w-1 h-full bg-slate-500 rounded-full hidden sm:block' />
      <ul className='sm:ml-16 overflow-hidden'>
        {experiencesData.map((position, index) => (
          <TimelineItem key={index} {...position} index={index} />
        ))}
      </ul>
    </div>
  </section>
);

export default Experience;
