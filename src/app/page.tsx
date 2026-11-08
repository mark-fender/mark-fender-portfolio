import Intro from '@/components/intro/Intro';
import Marquee from '@/components/Marquee';
import ProjectList from '@/components/projects/ProjectList';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Experience from '@/components/experience/Experience';
import Contact from '@/components/contact/Contact';
import SectionDivider from '@/components/SectionDivider';

// Rebuilt sections sit directly in <main>; the legacy ones keep the old centred wrapper until rebuilt.
const Home = () => {
  return (
    <main className='flex flex-col'>
      <Intro />
      <Marquee />
      <About />
      <Skills />
      <div className='main'>
        <Experience />
        <SectionDivider />
        <ProjectList />
        <SectionDivider />
        <Contact />
      </div>
    </main>
  );
};

export default Home;
