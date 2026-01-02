'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SiteFooter } from '@/components/footer';
import WhatsAppFAB from '@/components/whatsapp-fab';
import PromoBanner from '@/components/promo-banner';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings } from '@/lib/types';
import dynamic from 'next/dynamic';

const UserHeader = dynamic(() => import('@/components/user-header').then(mod => mod.UserHeader), {
  ssr: false,
  loading: () => <header className="flex h-16 items-center justify-between border-b bg-background px-4 container mx-auto" />,
});


export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({name: 'MRSHOPY', logoUrl: ''});

  useEffect(() => {
    // Only protect the /account route in this layout
    if (pathname === '/account' && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router, pathname]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "siteInfo"), (doc) => {
      if (doc.exists()) {
        setSiteSettings(doc.data() as SiteSettings);
      }
    });
    return () => unsub();
  }, []);

  // For /account page, show loader until auth state is resolved
  if (pathname === '/account' && loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (pathname === '/account' && !user) {
    return null;
  }

  // For other pages like /shop, render immediately
  return (
    <div className="flex min-h-screen w-full flex-col">
        <div className="sticky top-0 z-40 w-full bg-background">
            <UserHeader />
            <PromoBanner />
        </div>
        <main className="flex-1 p-4 pt-6 md:p-8 container max-w-6xl mx-auto">
            {children}
        </main>
        <WhatsAppFAB />
        <SiteFooter siteSettings={siteSettings} />
    </div>
  );
}
