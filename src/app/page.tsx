import Intro from '@/components/intro/Intro';
import ProjectList from '@/components/projects/ProjectList';
import SectionDivider from '@/components/SectionDivider';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Experience from '@/components/experience/Experience';
import Contact from '@/components/contact/Contact';

const Home = () => {
  return (
    <main className='main'>
      <Intro />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <ProjectList />
      <SectionDivider />
      <Contact />
    </main>
  );
};

export default Home;
