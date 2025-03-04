'use client';

import SectionHeading from '@/components/SectionHeading';
import { motion } from 'framer-motion';
import SubmitButton from '@/components/SubmitButton';
import useContact from './hooks/useContact';

const Contact = () => {
  const { sectionRef, handleFormSubmitAction } = useContact();

  return (
    <motion.section
      ref={sectionRef}
      id='contact'
      className='mb-24 w-[min(100%,38rem)]'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}>
      <SectionHeading>Contact me</SectionHeading>
      <form className='contact-form' action={handleFormSubmitAction}>
        <span className='w-full text-center mb-4'>
          Let&apos;s talk about possible collaboration.
        </span>
        <input
          required
          maxLength={150}
          type='email'
          autoComplete='off'
          name='senderEmail'
          className='contact-input'
          placeholder='Your e-mail.'
        />
        <textarea
          id='contact'
          maxLength={750}
          required
          name='message'
          className='contact-textarea'
          placeholder='Your message.'
        />
        <div className='w-full flex justify-center mt-4'>
          <SubmitButton />
        </div>
      </form>
    </motion.section>
  );
};

export default Contact;
