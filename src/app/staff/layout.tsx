'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { StaffSidebar } from '@/components/staff/sidebar';
import { AdminHeader } from '@/components/admin/header';

const STAFF_USERS = ['shafinkp444@gmail.com', 'staff1@gmail.com'];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user || !STAFF_USERS.includes(user.email ?? '')) {
      router.replace('/shop');
    }

  }, [user, loading, router, pathname]);

  if (loading || !user || !STAFF_USERS.includes(user.email ?? '')) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <StaffSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 pt-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
