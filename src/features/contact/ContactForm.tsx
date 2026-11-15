'use client';
import { type FormEvent, useEffect, useState, useTransition } from 'react';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { sendEmail } from './actions/sendEmail';
import SubmitButton from './SubmitButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UiCopy } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { EMAIL_MAX_LENGTH, MESSAGE_MAX_LENGTH, NAME_MAX_LENGTH } from '@/lib/validation';

const COOLDOWN_MS = 60_000;
type Field = 'senderName' | 'senderEmail' | 'message';

const FieldError = ({ name, error }: { name: Field; error?: string }) =>
  error ? (
    <p id={`${name}-error`} className='flex items-center gap-1.5 text-sm text-foreground'>
      <CircleAlert className='size-4 shrink-0' aria-hidden />
      {error}
    </p>
  ) : null;

type Props = { locale: Locale; copy: UiCopy['contact']['form'] };

const ContactForm = ({ locale, copy }: Props) => {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  // Client cooldown after a send; the server limiter is the real guard.
  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(() => setSent(false), COOLDOWN_MS);
    return () => clearTimeout(id);
  }, [sent]);

  // Show the validation text in the page instead of the browser's bubble, and in the page's
  // language: the browser's own message speaks the browser's.
  const onInvalid = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = e.target as HTMLInputElement;
    const { valueMissing, typeMismatch } = el.validity;
    const error = valueMissing
      ? copy.required
      : typeMismatch
        ? copy.invalidEmail
        : el.validationMessage;
    setErrors((prev) => ({ ...prev, [el.name]: error }));
  };
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const { name } = e.target as HTMLInputElement;
    if (errors[name as Field]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // onSubmit, not `action`: React resets a form after an action, which would wipe the text on failure.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      const { error } = await sendEmail(new FormData(form));
      if (error) return void toast.error(error);
      toast.success(copy.success);
      form.reset();
      setMessage('');
      setSent(true);
    });
  };

  const field = (name: Field) => ({
    id: name,
    name,
    required: true,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      // Without JS, never fall back to GET: it would put the message in the URL.
      method='post'
      onSubmit={onSubmit}
      onInvalid={onInvalid}
      onInput={onInput}
      className='flex flex-col gap-3.5 min-[920px]:gap-5'>
      <input name='website' tabIndex={-1} autoComplete='off' className='hidden' />
      <input type='hidden' name='locale' value={locale} />
      <div className='flex flex-col gap-3.5 min-[920px]:flex-row min-[920px]:flex-wrap min-[920px]:gap-4'>
        <div className='flex flex-col gap-2 min-[920px]:flex-[1_1_200px]'>
          <Label htmlFor='senderName'>{copy.name}</Label>
          <Input
            {...field('senderName')}
            type='text'
            maxLength={NAME_MAX_LENGTH}
            autoComplete='name'
            placeholder={copy.namePlaceholder}
          />
          <FieldError name='senderName' error={errors.senderName} />
        </div>
        <div className='flex flex-col gap-2 min-[920px]:flex-[1_1_200px]'>
          <Label htmlFor='senderEmail'>{copy.email}</Label>
          <Input
            {...field('senderEmail')}
            type='email'
            maxLength={EMAIL_MAX_LENGTH}
            autoComplete='email'
            placeholder={copy.emailPlaceholder}
          />
          <FieldError name='senderEmail' error={errors.senderEmail} />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='message'>{copy.message}</Label>
        <Textarea
          {...field('message')}
          rows={6}
          maxLength={MESSAGE_MAX_LENGTH}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.messagePlaceholder}
          className='h-43 max-[920px]:h-31'
        />
        <FieldError name='message' error={errors.message} />
      </div>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <span className='font-mono text-caption text-muted-foreground tabular-nums'>
          {message.length} / {MESSAGE_MAX_LENGTH}
        </span>
        <SubmitButton pending={pending} disabled={sent} label={sent ? copy.sent : copy.send} />
      </div>
    </form>
  );
};

export default ContactForm;
