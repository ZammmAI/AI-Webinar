import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from '../components/SEO';

interface LayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: LayoutProps) {
  return (
    <HelmetProvider>
      <SEO />
      <div className="min-h-screen font-sans antialiased text-slate-50">
        <main>{children}</main>
        <Toaster position="top-center" richColors />
      </div>
    </HelmetProvider>
  );
}
