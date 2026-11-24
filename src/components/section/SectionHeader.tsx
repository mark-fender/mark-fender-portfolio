import * as m from 'motion/react-client';
import { ease, RULE_DRAW_S } from '@/design-system/motion';

// A drawn rule that opens each section; the section's h2 carries the name.
const SectionHeader = () => (
  <m.div
    aria-hidden
    className='h-px origin-left bg-border'
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: RULE_DRAW_S, ease: ease.out }}
  />
);

export default SectionHeader;
