import SectionRule from '@/components/SectionRule';
import TextRevealOnScroll from '@/components/text-reveal/TextRevealOnScroll';

const paragraphs = [
  'I build interfaces that feel effortless to use and memorable to look at. Frontend development, for me, is the sweet spot where logical problem-solving meets creative expression — transforming ideas into smooth, intuitive, and visually engaging experiences.',
  'I focus on writing clean, well-structured code and crafting designs that are both functional and delightful to interact with. I enjoy working with modern tools and frameworks to deliver software that is robust, elegant, and built to last. Beyond writing code, I pay attention to the small details that make a big difference, from subtle animations to polished interaction flows.',
  "I'm endlessly curious, always exploring new technologies, experimenting with UI animations, and refining interaction details that elevate the user experience. My goal isn't just to deliver features, but to craft software that people genuinely enjoy using. When I'm not coding, you'll find me hiking, reading, or tinkering with side projects—always learning, always building.",
];

const About = () => (
  <section id='about' className='page-container pt-18 pb-0 min-[920px]:py-34'>
    <div className='mb-4.5 min-[920px]:mb-6'>
      <SectionRule id='about' />
    </div>
    <div className='flex flex-wrap gap-x-14 gap-y-4.5'>
      <div className='max-w-80 flex-[1_1_260px]'>
        <h2 className='text-section'>About me</h2>
      </div>
      <TextRevealOnScroll
        className='flex min-w-0 flex-[999_1_560px] flex-col gap-9 text-reveal'
        paragraphs={paragraphs}
      />
    </div>
  </section>
);

export default About;
