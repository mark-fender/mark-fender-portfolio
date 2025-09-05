import SectionHeading from '@/components/SectionHeading';
import { skillsData } from '@/lib/data';
import SkillItem from '@/components/SkillItem';

const Skills = () => (
  <section className='max-w-[53rem] scroll-mt-36 text-center' id='skills'>
    <SectionHeading>My skills</SectionHeading>
    <ul className='skills-list'>
      {skillsData.map((skill, index) => (
        <SkillItem key={skill.name} {...skill} index={index} />
      ))}
    </ul>
  </section>
);

export default Skills;
