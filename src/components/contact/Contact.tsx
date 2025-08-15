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
      className='mb-24 w-full'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}>
      <SectionHeading>Contact me</SectionHeading>

      <div className='relative flex flex-col justify-between bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 max-w-[55rem] transition border border-white/15 p-6 sm:p-8 rounded-lg shadow-lg shadow-black/[0.10] mx-auto'>
        <div className='mx-auto max-w-2xl text-center mb-8'>
          <h2 className='collaboration-text'>Let&apos;s talk about possible collaboration</h2>
          <p className='collaboration-subtitle'>
            Ready to bring your ideas to life? I&apos;m here to help create amazing digital
            experiences.
          </p>
        </div>

        <form className='w-full' action={handleFormSubmitAction}>
          <div className='grid grid-cols-1 gap-6'>
            <div>
              <label
                htmlFor='senderName'
                className='block text-sm font-semibold leading-6 text-white mb-2'>
                Name
              </label>
              <input
                type='text'
                name='senderName'
                id='senderName'
                required
                maxLength={100}
                autoComplete='name'
                className='contact-input block w-full rounded-lg px-4 py-3 text-white bg-slate-800 border border-black/25 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:border-blue-600 transition-colors'
                placeholder='Your name'
              />
            </div>

            <div>
              <label
                htmlFor='senderEmail'
                className='block text-sm font-semibold leading-6 text-white mb-2'>
                Email
              </label>
              <input
                type='email'
                name='senderEmail'
                id='senderEmail'
                required
                maxLength={150}
                autoComplete='email'
                className='contact-input block w-full rounded-lg px-4 py-3 text-white bg-slate-800 border border-black/25 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:border-blue-600 transition-colors'
                placeholder='your.email@example.com'
              />
            </div>

            <div>
              <label
                htmlFor='message'
                className='block text-sm font-semibold leading-6 text-white mb-2'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                rows={6}
                required
                maxLength={1000}
                className='contact-textarea block w-full rounded-lg px-4 py-3 text-white bg-slate-800 border border-black/25 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:border-blue-600 transition-colors resize-none'
                placeholder='Tell me about your project...'
              />
            </div>
          </div>

          <div className='mt-8 flex justify-center'>
            <SubmitButton />
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default Contact;
