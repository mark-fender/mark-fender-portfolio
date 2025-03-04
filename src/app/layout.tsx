import localFont from 'next/font/local';
import { ReactNode } from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher';
import { Toaster } from 'react-hot-toast';
import Providers from '@/app/providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
        <div className='bg-[#a6afec] absolute top-[-6rem] -z-10 right-[11rem] 2xl:right-[25rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[15rem] 
          sm:w-[68.75rem] dark:bg-[#5b639e]' />
        <div className='bg-[#9fddf4] absolute top-[-1rem] -z-10 left-[-50rem] h-[31.25rem] w-[50rem] rounded-full blur-[15rem] 
          sm:w-[68.75rem] sm:left-[-60rem] md:left-[-50rem] lg:left-[-35rem] xl:left-[-25rem] 2xl:left-[-5rem] dark:bg-[#70a3b6]' />
        <div className='bg-[#a6afec] absolute bottom-[-2rem] -z-10 right-[11rem] 2xl:right-[25rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[15rem] 
          sm:w-[68.75rem] dark:bg-[#5b639e]' />
        <div className='bg-[#9fddf4] absolute bottom-[2rem] -z-10 left-[-50rem] h-[31.25rem] w-[50rem] rounded-full blur-[15rem] 
          sm:w-[68.75rem] sm:left-[-60rem] md:left-[-50rem] lg:left-[-35rem] xl:left-[-25rem] 2xl:left-[-5rem] dark:bg-[#70a3b6]' />
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster position='top-right' />
          <ThemeSwitcher />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
