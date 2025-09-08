import Intro from '@/components/intro/Intro';
import ProjectList from '@/components/projects/ProjectList';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Experience from '@/components/experience/Experience';
import Contact from '@/components/contact/Contact';
import SectionDivider from '@/components/SectionDivider';

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
