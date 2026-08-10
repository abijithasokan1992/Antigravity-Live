import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'StreamVista AI Media Services',
  description: 'AI-assisted dubbing, subtitles, audio description, editing, visual design and media delivery services for film and content owners.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-x-hidden font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
