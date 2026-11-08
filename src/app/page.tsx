import Intro from '@/components/intro/Intro';
import OffTheClock from '@/components/OffTheClock';
import Marquee from '@/components/Marquee';
import ProjectsSection from '@/components/projects/ProjectsSection';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Experience from '@/components/experience/Experience';
import Contact from '@/components/contact/Contact';

// Rebuilt sections sit directly in <main>; the legacy ones keep the old centred wrapper until rebuilt.
// Tenure ("3 yrs 7 mos") is computed on the server; rebuild daily so it stays current (§2.5).
export const revalidate = 86400;

const Home = () => {
  return (
    <main className='flex flex-col'>
      <Intro />
      <Marquee />
      <About />
      <Skills />
      <Experience />
      <ProjectsSection />
      <OffTheClock />
      <div className='main'>
        <Contact />
      </div>
    </main>
  );
};

export default Home;
