import '@/app/ui/global.css'
import { jetBrainsMono, lusitana } from './ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.className} antialiased`}>{children}</body>
    </html>
  );
}
