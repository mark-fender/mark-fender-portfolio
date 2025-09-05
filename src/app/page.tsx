import Intro from '@/components/intro/Intro';
import ProjectList from '@/components/projects/ProjectList';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Experience from '@/components/experience/Experience';
import Contact from '@/components/contact/Contact';

const Home = () => {
  return (
    <main className='main'>
        <Intro />
        <About />
        <Skills />
        <Experience />
        <ProjectList />
        <Contact />
    </main>
  );
};

export default Home;
