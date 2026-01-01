'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LayoutDashboard } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

function UserHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/shop" className="flex items-center gap-2 font-headline text-lg font-semibold">
          <Logo className="h-6 w-6 text-primary" />
          <span>Gift Admin Pro</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Panel
            </Link>
          </Button>
          <AdminHeader />
        </div>
      </div>
    </header>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <UserHeader />
        <main className="flex-1 p-4 pt-6 md:p-8 container max-w-6xl mx-auto">
            {children}
        </main>
    </div>
  );
}
