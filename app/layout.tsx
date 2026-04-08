import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YuGiOh Orders',
  description: 'Praćenje prodaje Yu-Gi-Oh karata',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
