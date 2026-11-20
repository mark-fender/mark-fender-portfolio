import type { Locale } from '@/lib/i18n';

const NewTabCue = ({ locale, text }: { locale: Locale; text: string }) => (
  <span lang={locale} className='sr-only'>
    {' '}
    ({text})
  </span>
);

export default NewTabCue;
