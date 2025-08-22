import localFont from 'next/font/local';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';
import Providers from '@/app/providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Aurora from '@/components/Aurora';

const satoshi = localFont({
  src: [
    {
      path: './fonts/Satoshi-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Satoshi-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});

const AURORA_COLORS = ['#2d95eb', '#9737C3', '#08d1bd'];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.markfender.dev/';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Marek Lipčák',
    template: '%s | Marek Lipčák',
  },
  description: "Marek Lipčák's personal web developer portfolio.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Marek Lipčák',
    description: "Marek Lipčák's personal web developer portfolio.",
    url: SITE_URL,
    siteName: 'Marek Lipčák',
    images: [
      {
        url: '/assets/photo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Marek Lipčák portrait',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marek Lipčák',
    description: "Marek Lipčák's personal web developer portfolio.",
    images: ['/assets/photo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang='en' className='scroll-smooth!' suppressHydrationWarning>
    <body
      className={`${satoshi.className} text-gray-50 text-opacity-900 relative pt-28 sm:pt-36 overscroll-none bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800`}>
      <Aurora colorStops={AURORA_COLORS} blend={0.75} amplitude={0.75} speed={0.5} />
      <Providers>
        <Header />
        {children}
        <Toaster position='top-right' />
      </Providers>
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
