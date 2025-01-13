import '@/app/ui/global.css';
import { jetBrainsMono, lusitana } from './ui/fonts';
import { AuthProvider } from './lib/userContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          {/* Utilisation de la favicon en format PNG */}
          <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png"/>
        </head>
        <body className={`${jetBrainsMono.className} antialiased`}>
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}

