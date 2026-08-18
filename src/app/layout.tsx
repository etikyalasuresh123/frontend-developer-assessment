import type { Metadata } from 'next';
import './globals.css';
import { MSWProvider } from '@/components/MSWProvider';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Student Management Dashboard',
  description: 'Frontend Developer Assessment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MSWProvider>
          <Sidebar />

          <div className="min-h-screen md:ml-64">
            {children}
             <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }} />
          </div>
        </MSWProvider>
      </body>
    </html>
  );
}