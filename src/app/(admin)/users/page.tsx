'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type Customer = {
  email: string;
  name: string;
  orderCount: number;
  lastOrder: string;
};

export default function UsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customerMap = new Map<string, Customer>();

      snapshot.docs.forEach(doc => {
        const order = doc.data() as Omit<Order, 'id'>;
        if (!order.customerEmail) return;

        if (customerMap.has(order.customerEmail)) {
          const existingCustomer = customerMap.get(order.customerEmail)!;
          existingCustomer.orderCount++;
          // The first one we see is the latest because of the query order
        } else {
          customerMap.set(order.customerEmail, {
            email: order.customerEmail,
            name: order.customerName,
            orderCount: 1,
            lastOrder: new Date(order.date).toLocaleDateString(),
          });
        }
      });
      
      setCustomers(Array.from(customerMap.values()));
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch user data:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch user data. Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : name[0];
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">User Management</h1>
        <p className="text-muted-foreground">View and manage your customers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Customers ({customers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Total Orders</TableHead>
                <TableHead className="text-right">Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                           {/* There's no photoURL in order data, so we use initials */}
                           <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{customer.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-center">{customer.orderCount}</TableCell>
                  <TableCell className="text-right">{customer.lastOrder}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
