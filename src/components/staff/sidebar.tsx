'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';


const navItems = [
  { href: '/staff/products', label: 'Products', icon: Gift },
];

export function StaffSidebar() {
  const pathname = usePathname();
  const [siteSettings, setSiteSettings] = useState<{name: string, logoUrl: string}>({name: 'MRSHOPY', logoUrl: ''});
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "siteInfo"), (doc) => {
      if (doc.exists()) {
        setSiteSettings(doc.data() as SiteSettings);
      }
    });
    return () => unsub();
  }, []);

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/staff/products" className="flex items-center gap-2 font-headline text-lg font-semibold">
          <Logo logoUrl={siteSettings.logoUrl} className="h-6 w-6 text-primary" />
          <span>{siteSettings.name}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <div className="text-xs uppercase text-muted-foreground p-2">Staff Panel</div>
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
