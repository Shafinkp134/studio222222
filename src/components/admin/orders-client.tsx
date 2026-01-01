'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { updateOrderTransactionId } from '@/app/actions';
import { Eye, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const statusVariant = {
  Delivered: 'default',
  Shipped: 'secondary',
  Pending: 'outline',
  Cancelled: 'destructive',
} as const;

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch orders in real-time:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch orders. Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setTransactionId(order.transactionId || '');
  };

  const handleUpdateTransactionId = () => {
    if (!selectedOrder) return;

    startTransition(async () => {
      try {
        await updateOrderTransactionId(selectedOrder.id, transactionId);
        setSelectedOrder(null);
        toast({
          title: 'Success',
          description: 'Transaction ID updated.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update transaction ID.',
          variant: 'destructive',
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Customer: {selectedOrder?.customerName} ({selectedOrder?.customerEmail})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="space-y-1">
              <p className="text-sm font-medium">Phone:</p>
              <p className="text-sm text-muted-foreground">{selectedOrder?.phone || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Items:</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5">
                {selectedOrder?.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Shipping Address:</p>
              <p className="text-sm text-muted-foreground">{selectedOrder?.shippingAddress}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-id">Transaction ID</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="transaction-id"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                />
                 {selectedOrder?.transactionId && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
            <Button onClick={handleUpdateTransactionId} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Transaction ID'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
