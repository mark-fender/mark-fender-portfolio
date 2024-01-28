'use client';

import useSectionInView from '../hooks/useSectionInView';
import SectionHeading from './SectionHeading';
import { motion } from 'framer-motion';
import { sendEmail } from '../actions/sendEmail';
import SubmitButton from './SubmitButton';
import { MdCheck, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import { ReactNode } from 'react';
import clsx from 'clsx';

const Contact = () => {
  const { ref } = useSectionInView({ sectionName: 'Contact' });

  const handleFormSubmitAction = async (formData: FormData) => {
    const { data, error } = await sendEmail(formData);
    if (error) {
      popToast(error, <MdClose />);
    }
    if (data) {
      popToast('E-mail sent successfully!', <MdCheck />);
    }
  };

  return (
    <motion.section
      ref={ref}
      id='contact'
      className='mb-24 w-[min(100%,38rem)]'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}>
      <SectionHeading>Contact me</SectionHeading>
      <form className='mt-4 flex flex-col' action={handleFormSubmitAction}>
        <span className='w-full text-center mb-4'>
          Let&apos;s talk about possible collaboration.
        </span>
        <input
          required
          maxLength={150}
          type='email'
          autoComplete='off'
          name='senderEmail'
          className='h-14 px-4 rounded-lg borderBlack dark:bg-gray-700'
          placeholder='Your e-mail.'
        />
        <textarea
          id='contact'
          maxLength={750}
          required
          name='message'
          className='h-52 p-4 my-3 rounded-lg borderBlack resize-none dark:bg-gray-700'
          placeholder='Your message.'
        />
        <div className='w-full flex justify-center mt-4'>
          <SubmitButton />
        </div>
      </form>
    </motion.section>
  );
};

const popToast = (message: string, icon: ReactNode) => {
  toast.custom((t) => (
    <div
      className={clsx(
        'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex text-gray-900 dark:bg-gray-900 dark:text-gray-50',
        {
          'animate-enter': t.visible,
          'animate-leave': !t.visible,
        },
      )}>
      <div className='flex-1 w-0 p-4'>
        <div className='flex items-start'>
          {icon}
          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium'>{message}</p>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default Contact;
