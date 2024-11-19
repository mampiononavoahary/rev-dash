import '@/app/ui/global.css'
import { jetBrainsMono, lusitana } from './ui/fonts';
import Provider from './Provider';
import { AuthProvider } from './lib/userContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${jetBrainsMono.className} antialiased`}>
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
