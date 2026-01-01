import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings } from '@/lib/types';

// This function can be used in other layouts as well.
export async function generateSiteMetadata() {
  const siteSettingsRef = doc(db, 'settings', 'siteInfo');
  try {
    const docSnap = await getDoc(siteSettingsRef);
    if (docSnap.exists()) {
      const settings = docSnap.data() as SiteSettings;
      return {
        title: settings.name || 'MRSHOPY',
        description: `Your one-stop shop for everything from ${settings.name || 'MRSHOPY'}`,
      };
    }
  } catch (error) {
    console.error("Could not fetch site settings for metadata:", error);
  }
  return {
    title: 'MRSHOPY',
    description: 'Your one-stop shop for everything',
  };
}


export async function generateMetadata(): Promise<Metadata> {
  return await generateSiteMetadata();
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
