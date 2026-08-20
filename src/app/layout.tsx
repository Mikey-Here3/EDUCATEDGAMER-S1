import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'Educated Gamer | Free Fire Tournament',
  description: 'Premium Free Fire Esports Tournament by Educated Gamer',
  openGraph: {
    title: 'Educated Gamer | Free Fire Tournament',
    description: 'Premium Free Fire Esports Tournament by Educated Gamer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educated Gamer | Free Fire Tournament',
    description: 'Premium Free Fire Esports Tournament by Educated Gamer',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <TooltipProvider>
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
