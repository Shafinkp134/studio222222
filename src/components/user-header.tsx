
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, LayoutDashboard, Menu, ShoppingBag, User as UserIcon, Briefcase, Search, Store, Info, Phone, MessageSquareQuestion } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings, Product } from '@/lib/types';
import { Input } from '@/components/ui/input';

const ADMIN_EMAIL = 'admin1@gmail.com';
const STAFF_USERS = ['shafinkp444@gmail.com', 'staff1@gmail.com'];

function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim());
        } else {
            params.delete('q');
        }
        
        // If we are not on the shop page, navigate to it with the query
        if(pathname !== '/shop') {
            router.push(`/shop?${params.toString()}`);
        } else {
            router.replace(`/shop?${params.toString()}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Input
                type="search"
                placeholder="Search products..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
            </Button>
        </form>
    );
}

export function UserHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const isStaff = user?.email && STAFF_USERS.includes(user.email);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({name: 'MRSHOPY', logoUrl: ''});

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "settings", "siteInfo"), (doc) => {
      if (doc.exists()) {
        setSiteSettings(doc.data() as SiteSettings);
      }
    });

    return () => {
        unsubSettings();
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-auto flex-wrap items-center justify-between gap-4 border-b bg-background px-4 py-3 container mx-auto md:h-20 md:flex-nowrap">
        <Link href="/shop" className="flex items-center gap-2 font-headline text-lg font-semibold">
          <Logo logoUrl={siteSettings.logoUrl} className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">{siteSettings.name}</span>
        </Link>
        
        <div className="order-3 w-full md:order-2 md:w-auto flex-1 md:max-w-md lg:max-w-lg flex items-center gap-2">
            <SearchBar />
        </div>

        <div className="order-2 flex items-center gap-2 md:order-3 md:gap-4">
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
                  {isAdmin && (
                    <Button variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'} asChild>
                        <Link href="/admin/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Panel
                        </Link>
                    </Button>
                  )}
                  {isStaff && (
                    <Button variant={pathname.startsWith('/staff') ? 'secondary' : 'ghost'} asChild>
                        <Link href="/staff/products">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Staff Panel
                        </Link>
                    </Button>
                  )}
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
                            <Logo logoUrl={siteSettings.logoUrl} className="h-6 w-6 text-primary" />
                            <span>{siteSettings.name}</span>
                        </Link>
                        <Link href="/shop" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/shop' && 'bg-muted text-primary')}>
                          <ShoppingBag className="h-4 w-4" />
                          Shop
                        </Link>
                         <Link href="/about" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/about' && 'bg-muted text-primary')}>
                          <Info className="h-4 w-4" />
                          About Us
                        </Link>
                         <Link href="/contact-us" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/contact-us' && 'bg-muted text-primary')}>
                          <Phone className="h-4 w-4" />
                          Contact Us
                        </Link>
                         <Link href="/faq" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/faq' && 'bg-muted text-primary')}>
                          <MessageSquareQuestion className="h-4 w-4" />
                          FAQ
                        </Link>
                        {user && (
                            <>
                                <Link href="/account" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname === '/account' && 'bg-muted text-primary')}>
                                    <UserIcon className="h-4 w-4" />
                                    Account
                                </Link>
                                {isAdmin && (
                                  <Link href="/admin/dashboard" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname.startsWith('/admin') && 'bg-muted text-primary')}>
                                      <LayoutDashboard className="h-4 w-4" />
                                      Admin Panel
                                  </Link>
                                )}
                                 {isStaff && (
                                  <Link href="/staff/products" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', pathname.startsWith('/staff') && 'bg-muted text-primary')}>
                                      <Briefcase className="h-4 w-4" />
                                      Staff Panel
                                  </Link>
                                )}
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
