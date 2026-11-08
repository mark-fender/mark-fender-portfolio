import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';
import Providers from '@/app/providers';
import { navBarLinks } from '@/lib/data';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.markfender.dev/';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Marek Lipčák',
    template: '%s | Marek Lipčák',
  },
  description: "Marek Lipčák's personal web developer portfolio.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Marek Lipčák',
    description: "Marek Lipčák's personal web developer portfolio.",
    url: siteUrl,
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
  <html
    lang='en'
    className={`${inter.variable} ${jetbrainsMono.variable} motion-safe:scroll-smooth scroll-pt-24`}
    suppressHydrationWarning>
    <body className='flex min-h-dvh flex-col overscroll-none'>
      <Providers>
        <Header links={navBarLinks} />
        {children}
        <Toaster position='top-right' />
      </Providers>
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
