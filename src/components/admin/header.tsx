'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon, Menu, LayoutGrid, Gift, ClipboardList, LogIn, Users, Megaphone, Settings, Store } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Logo } from '../logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';

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

function MobileNav() {
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
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                    <SheetDescription className="sr-only">Admin navigation menu</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold">
                        <Logo logoUrl={siteSettings.logoUrl} className="h-6 w-6 text-primary" />
                        <span>{siteSettings.name}</span>
                    </Link>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                          pathname === item.href && 'bg-muted text-primary'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}

export function AdminHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'A';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };
  
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (!user) {
    return (
        <Button asChild>
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4"/>
                Login
            </Link>
        </Button>
    )
  }

  return (
    <header className={cn("flex h-14 items-center gap-4", isAdminRoute ? 'justify-between md:justify-end sticky top-0 z-30 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6' : 'justify-end')}>
       {isAdminRoute && (
        <div className="md:hidden">
            <MobileNav />
       </div>
       )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
