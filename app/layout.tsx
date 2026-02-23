// Providers
import { AuthProvider } from '@/shared/core/contexts/AuthContext';
import { QueryProvider } from '@/shared/providers/QueryProvider';

// Components
import { AppFooter } from '@/shared/components/Footer/AppFooter';

// Styles
import './globals.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
            <AppFooter />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
