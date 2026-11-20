import { Loader2Icon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = { pending: boolean; disabled: boolean; label: string };

// aria-disabled preserves focus; the form guards repeat submissions.
const SubmitButton = ({ pending, disabled, label }: Props) => (
  <Button
    type='submit'
    size='cta'
    aria-disabled={pending || disabled || undefined}
    className='aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:active:scale-100'>
    {label}
    {pending ? (
      <Loader2Icon className='size-4 animate-spin' aria-hidden />
    ) : (
      <Send className='size-4' strokeWidth={1.75} aria-hidden />
    )}
  </Button>
);

export default SubmitButton;
