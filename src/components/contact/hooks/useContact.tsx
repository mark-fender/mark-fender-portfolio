import { sendEmail } from '@/actions/sendEmail';
import toast, { Toast } from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import { MdCheck, MdClose } from 'react-icons/md';
import { JSX } from 'react';

const useContact = () => {
  const handleFormSubmitAction = async (formData: FormData) => {
    const { data, error } = await sendEmail(formData);
    if (error) {
      popToast(error, <MdClose />);
    }
    if (data) {
      popToast('E-mail sent successfully!', <MdCheck />);
    }
  };

  const popToast = (message: string, icon: JSX.Element) => {
    toast.custom((toast: Toast) => <CustomToast toast={toast} message={message} icon={icon} />);
  };

  return {
    handleFormSubmitAction,
  };
};

export default useContact;
