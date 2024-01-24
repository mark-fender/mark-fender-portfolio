import { useFormStatus } from 'react-dom';
import { FaPaperPlane } from 'react-icons/fa';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='group flex items-center justify-center  gap-2 h-[3rem] w-[8rem] bg-gray-900 text-white rounded-full 
          outline-none transition-all hover:scale-110 hover:bg-gray-950 active:scale-105 disabled:scale-100 disabled:opacity-65 dark:bg-white/10 sm:dark:bg-gray-900/60'>
      {pending ? (
        <div className='h-5 w-5 animate-spin rounded-full border-b-2 border-white' />
      ) : (
        <>
          Submit{' '}
          <FaPaperPlane className='text-xs opacity-70 transition-all group-hover:translate-x-1 group-hover:-translate-y-1' />
        </>
      )}
    </button>
  );
};

export default SubmitButton;
