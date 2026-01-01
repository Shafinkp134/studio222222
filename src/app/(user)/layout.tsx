'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, LayoutDashboard, Menu, ShoppingBag, User as UserIcon } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { SiteFooter } from '@/components/footer';
import WhatsAppFAB from '@/components/whatsapp-fab';
import PromoBanner from '@/components/promo-banner';


function UserHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/shop" className="flex items-center gap-2 font-headline text-lg font-semibold">
          <Logo className="h-6 w-6 text-primary" />
          <span>MRSHOPY</span>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <Button variant={pathname === '/shop' ? 'secondary' : 'ghost'} asChild>
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop
            </Link>
          </Button>
          {user && (
            <>
              <Button variant={pathname === '/account' ? 'secondary' : 'ghost'} asChild>
                <Link href="/account">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </Button>
              <Button variant={pathname.startsWith('/dashboard') || pathname.startsWith('/products') || pathname.startsWith('/orders') ? 'secondary' : 'ghost'} asChild>
                  <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Panel
                  </Link>
              </Button>
            </>
          )}
          <AdminHeader />
        </div>
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium">
                    <Link href="/shop" className="flex items-center gap-2 font-headline text-lg font-semibold mb-4">
                        <Logo className="h-6 w-6 text-primary" />
                        <span>MRSHOPY</span>
                    </Link>
                    <Link href="/shop" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/shop' && 'bg-muted text-primary')}>
                      <ShoppingBag className="h-4 w-4" />
                      Shop
                    </Link>
                    {user && (
                        <>
                            <Link href="/account" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/account' && 'bg-muted text-primary')}>
                                <UserIcon className="h-4 w-4" />
                                Account
                            </Link>
                            <Link href="/dashboard" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/dashboard' && 'bg-muted text-primary')}>
                                <LayoutDashboard className="h-4 w-4" />
                                Admin Panel
                            </Link>
                        </>
                    )}
                    <div className="absolute bottom-4 right-4">
                        <AdminHeader />
                    </div>
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only protect the /account route in this layout
    if (pathname === '/account' && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router, pathname]);

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
        <UserHeader />
        <main className="flex-1 p-4 pt-6 md:p-8 container max-w-6xl mx-auto">
            {children}
        </main>
        <WhatsAppFAB />
        <PromoBanner />
        <SiteFooter />
    </div>
  );
}
