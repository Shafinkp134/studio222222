import type { Order } from '@/lib/types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import OrdersClient from '@/components/admin/orders-client';

async function getOrders(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('date', 'desc'));
    const ordersSnapshot = await getDocs(q);
    const ordersList = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    return ordersList;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const initialOrders = await getOrders();
  
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>
      <OrdersClient initialOrders={initialOrders} />
    </div>
  );
}
