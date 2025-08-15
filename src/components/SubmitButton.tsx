import { useFormStatus } from 'react-dom';
import { FaPaperPlane } from 'react-icons/fa';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type='submit' disabled={pending} className='submit-button group'>
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
