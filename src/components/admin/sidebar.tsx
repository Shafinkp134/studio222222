'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { LayoutGrid, Gift, ClipboardList, Users, Megaphone, Settings, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

const SUPER_ADMINS = ['admin1@gmail.com'];

const allNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid, requiredRole: 'all' },
  { href: '/admin/products', label: 'Products', icon: Gift, requiredRole: 'all' },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList, requiredRole: 'super' },
  { href: '/admin/users', label: 'Users', icon: Users, requiredRole: 'super' },
  { href: '/admin/banner', label: 'Banner', icon: Megaphone, requiredRole: 'super' },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings, requiredRole: 'super' },
  { href: '/admin/shopy', label: 'Shopy', icon: Store, requiredRole: 'super' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [siteSettings, setSiteSettings] = useState<{name: string, logoUrl: string}>({name: 'MRSHOPY', logoUrl: ''});
  const isSuperAdmin = user && SUPER_ADMINS.includes(user.email ?? '');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "siteInfo"), (doc) => {
      if (doc.exists()) {
        setSiteSettings(doc.data() as SiteSettings);
      }
    });
    return () => unsub();
  }, []);

  const navItems = allNavItems.filter(item => {
    if (item.requiredRole === 'super') {
      return isSuperAdmin;
    }
    return true;
  });

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold">
          <Logo logoUrl={siteSettings.logoUrl} className="h-6 w-6 text-primary" />
          <span>{siteSettings.name}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? 'secondary' : 'ghost'}
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
