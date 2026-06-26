import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/lib/apollo/provider';
import { Toaster } from '@/components/ui/Toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Novologic Workbook',
  description: 'Online workbook with uploads, autosave, and version history.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
