'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

const SUPER_ADMINS = ['admin1@gmail.com'];
const PRODUCT_MANAGERS: string[] = []; // Shafin is now a staff member, not a product manager in the admin panel
const ALL_ADMINS = [...SUPER_ADMINS, ...PRODUCT_MANAGERS];

const RESTRICTED_FOR_PRODUCT_MANAGER = [
  '/admin/orders',
  '/admin/users',
  '/admin/banner',
  '/admin/settings',
  '/admin/shopy',
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user || !ALL_ADMINS.includes(user.email ?? '')) {
      router.replace('/shop');
      return;
    }

    const isProductManager = PRODUCT_MANAGERS.includes(user.email ?? '');
    if (isProductManager && RESTRICTED_FOR_PRODUCT_MANAGER.includes(pathname)) {
      router.replace('/admin/dashboard');
    }

  }, [user, loading, router, pathname]);

  if (loading || !user || !ALL_ADMINS.includes(user.email ?? '')) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isProductManager = PRODUCT_MANAGERS.includes(user.email ?? '');
  if (isProductManager && RESTRICTED_FOR_PRODUCT_MANAGER.includes(pathname)) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 pt-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
