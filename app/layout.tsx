import '@/app/ui/global.css'
import { AuthProvider } from './lib/userContext';
import { jetBrainsMono, lusitana } from './ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
       <html lang="en">
         <body className={`${jetBrainsMono.className} antialiased`}>{children}</body>
       </html>
    </AuthProvider>
   
  );
}
