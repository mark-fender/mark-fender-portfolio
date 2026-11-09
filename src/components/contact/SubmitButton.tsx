import { Loader2Icon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = { pending: boolean; disabled: boolean; label: string };

const SubmitButton = ({ pending, disabled, label }: Props) => (
  <Button type='submit' size='cta' disabled={pending || disabled} className='max-[920px]:flex-1'>
    {label}
    {pending ? (
      <Loader2Icon className='size-4 animate-spin' aria-hidden />
    ) : (
      <Send className='size-4' strokeWidth={1.75} aria-hidden />
    )}
  </Button>
);

export default SubmitButton;
