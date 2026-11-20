'use client';
import { type FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { type ContactField, sendEmail } from './actions/sendEmail';
import SubmitButton from './SubmitButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UiCopy } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { EMAIL_MAX_LENGTH, MESSAGE_MAX_LENGTH, NAME_MAX_LENGTH } from '@/lib/validation';

const COOLDOWN_MS = 60_000;

const ErrorText = ({ id, children }: { id?: string; children: string }) => (
  <span id={id} className='flex items-start gap-1.5 text-ui text-foreground'>
    <CircleAlert className='mt-0.75 size-4 shrink-0 text-danger' aria-hidden />
    {children}
  </span>
);

const FieldError = ({ name, error }: { name: ContactField; error?: string }) =>
  error ? <ErrorText id={`${name}-error`}>{error}</ErrorText> : null;

type Props = { locale: Locale; copy: UiCopy['contact']['form'] };

const ContactForm = ({ locale, copy }: Props) => {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  // The browser fires `invalid` once per bad field on submit; only the first takes focus.
  const focusedInvalid = useRef(false);

  // Client cooldown after a send; the server limiter is the real guard.
  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(() => setSent(false), COOLDOWN_MS);
    return () => clearTimeout(id);
  }, [sent]);

  // Localized errors replace the native bubble; cancelling it also requires restoring focus.
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
    if (!focusedInvalid.current) {
      focusedInvalid.current = true;
      el.focus();
      setTimeout(() => (focusedInvalid.current = false));
    }
  };
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const { name } = e.target as HTMLInputElement;
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // onSubmit, not `action`: React resets a form after an action, which would wipe the text on failure.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending || sent) return;
    const form = e.currentTarget;
    setFormError(null);
    startTransition(async () => {
      let result: Awaited<ReturnType<typeof sendEmail>>;
      try {
        result = await sendEmail(new FormData(form));
      } catch {
        setFormError(copy.offline);
        return;
      }
      const { error, field } = result;
      if (error && field) {
        setErrors((prev) => ({ ...prev, [field]: error }));
        const input = form.elements.namedItem(field);
        if (input instanceof HTMLElement) input.focus();
        return;
      }
      if (error) return setFormError(error);
      toast.success(copy.success);
      form.reset();
      setMessage('');
      setSent(true);
    });
  };

  const field = (name: ContactField, describedBy?: string) => {
    const ids = [errors[name] && `${name}-error`, describedBy].filter(Boolean).join(' ');
    return {
      id: name,
      name,
      required: true,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': ids || undefined,
    };
  };

  return (
    <form
      // Without JS, never fall back to GET: it would put the message in the URL.
      method='post'
      onSubmit={onSubmit}
      onInvalid={onInvalid}
      onInput={onInput}
      aria-describedby='contact-required'
      className='flex flex-col gap-3.5 min-[920px]:gap-5'>
      <p id='contact-required' className='text-label text-muted-foreground'>
        {copy.requiredHint}
      </p>
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
          {...field('message', 'message-count')}
          rows={6}
          maxLength={MESSAGE_MAX_LENGTH}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.messagePlaceholder}
          className='h-43 max-[920px]:h-31'
        />
        <FieldError name='message' error={errors.message} />
      </div>
      {/* Always in the page, so assistive tech is already listening when a message lands in it. */}
      <p role='alert' className='empty:hidden'>
        {formError && <ErrorText>{formError}</ErrorText>}
      </p>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <span
          id='message-count'
          className='font-mono text-caption text-muted-foreground tabular-nums'>
          {message.length} / {MESSAGE_MAX_LENGTH}
        </span>
        <SubmitButton
          pending={pending}
          disabled={sent}
          label={pending ? copy.sending : sent ? copy.sent : copy.send}
        />
      </div>
    </form>
  );
};

export default ContactForm;
