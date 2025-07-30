import localFont from 'next/font/local';
import { ReactNode } from 'react';
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

const auroraColors = ["#2d95eb", "#9737C3", "#08d1bd"]

export const metadata = {
  title: 'Marek Lipčák',
  description: "Marek Lipčák's personal web developer portfolio.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang='en' className='scroll-smooth!' suppressHydrationWarning>
      <body
        className={`${satoshi.className} bg-slate-200 text-gray-950 relative pt-28 sm:pt-36 
      dark:bg-slate-800 dark:text-gray-50 dark:text-opacity-900 overscroll-none`}>
        <Aurora
        colorStops={auroraColors}
        blend={0.75}
        amplitude={0.75}
        speed={0.5}
        />
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
};

export default RootLayout;
