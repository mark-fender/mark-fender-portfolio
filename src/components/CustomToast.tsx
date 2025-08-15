import clsx from 'clsx';
import { JSX } from 'react';
import { Toast } from 'react-hot-toast';

type CustomToastProps = {
  toast: Toast;
  message: string;
  icon: JSX.Element;
};

const CustomToast = ({ toast, message, icon }: CustomToastProps) => (
  <div
    className={clsx('custom-toast', {
      'animate-enter': toast.visible,
      'animate-leave': !toast.visible,
    })}>
    <div className='flex-1 w-0 p-4'>
      <div className='flex items-start'>
        {icon}
        <div className='ml-3 flex-1'>
          <p className='text-sm font-medium'>{message}</p>
        </div>
      </div>
    </div>
  </div>
);

export default CustomToast;
