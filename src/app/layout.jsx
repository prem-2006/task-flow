import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'TaskFlow — Your Intelligent Workspace',
  description:
    'Tasks, calendar, and AI working together in one place. The smart productivity app for students and professionals.',
  keywords: ['task manager', 'productivity', 'AI assistant', 'calendar', 'project management'],
  openGraph: {
    title: 'TaskFlow — Your Intelligent Workspace',
    description:
      'Tasks, calendar, and AI working together in one place.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
