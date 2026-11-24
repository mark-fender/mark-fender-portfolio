import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import '@/app/globals.css';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/app/providers';
import { navLinks, spySections } from '@/content/nav';
import { site, socials } from '@/content/site';
import { ui } from '@/content/ui';
import {
  defaultLocale,
  fill,
  isLocale,
  localePath,
  locales,
  ogLocale,
  otherLocale,
  type Locale,
} from '@/lib/i18n';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  // Preload latin only; the latin-ext @font-face (for "č") is still emitted and loads on demand.
  subsets: ['latin'],
  variable: '--font-inter',
  // Optical size: the headlines get Inter's tighter Display drawing instead of the text cut scaled up.
  axes: ['opsz'],
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  // Mono is only small labels; not preloading it keeps it from competing with the LCP text.
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export const generateStaticParams = () => locales.map((lang) => ({ lang }));
export const dynamicParams = false;

// A 404 page also renders this layout, with whatever the first segment was.
const localeOf = async (params: Promise<{ lang: string }>): Promise<Locale> => {
  const { lang } = await params;
  return isLocale(lang) ? lang : defaultLocale;
};

export const generateMetadata = async ({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> => {
  const locale = await localeOf(params);
  const url = new URL(localePath(locale), siteUrl).href;
  const description = site.description[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, new URL(localePath(l), siteUrl).href])),
        'x-default': new URL(localePath(defaultLocale), siteUrl).href,
      },
    },
    openGraph: {
      title: site.name,
      description,
      url,
      siteName: site.name,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: site.name,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

const personJsonLd = (locale: Locale) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: siteUrl,
    jobTitle: site.role,
    description: site.description[locale],
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: site.country },
    sameAs: socials.map((social) => social.href),
  }).replace(/</g, '\\u003c');

const RootLayout = async ({ children, params }: LayoutProps<'/[lang]'>) => {
  const locale = await localeOf(params);
  const copy = ui[locale];
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} motion-safe:scroll-smooth scroll-pt-24`}
      suppressHydrationWarning>
      <body className='flex min-h-dvh flex-col overscroll-none'>
        {/* Show server-rendered content when entrance animations cannot run. */}
        <noscript>
          <style>
            {
              "[style*='opacity:0'],[style*='translateY(105%)'],[style*='clip-path']{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}"
            }
          </style>
        </noscript>
        <a
          href='#main'
          className='sr-only rounded-full bg-primary px-5 py-3 text-ui font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-100'>
          {copy.header.skip}
        </a>
        <Providers>
          <Header
            links={navLinks(locale)}
            spy={spySections}
            locale={locale}
            copy={{ ...copy.header, home: fill(copy.header.home, { name: site.name }) }}
          />
          {children}
          <Footer
            name={site.name}
            city={site.city}
            timeZone={site.timeZone}
            locale={locale}
            backToTop={copy.footer.backToTop}
          />
          <Toaster position='top-right' containerAriaLabel={copy.notifications} />
        </Providers>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: personJsonLd(locale) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
