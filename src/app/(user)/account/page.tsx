'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const statusVariant = {
  Delivered: 'default',
  Shipped: 'secondary',
  Pending: 'outline',
  Cancelled: 'destructive',
} as const;

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    const ordersCol = collection(db, 'orders');
    const q = query(
      ordersCol,
      where('customerEmail', '==', user.email)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        // Sort orders by date on the client side
        ordersList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(ordersList);
        setOrdersLoading(false);
      },
      (error) => {
        console.error('Failed to fetch orders:', error);
        setOrdersLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'A';
    const names = name.split(' ');
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : name[0];
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your profile details.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.photoURL ?? ''} />
            <AvatarFallback className="text-3xl">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold">{user.displayName || 'No name provided'}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="ml-auto">
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Here's a list of your past orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">You haven't placed any orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
