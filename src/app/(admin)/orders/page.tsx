import OrdersClient from '@/components/admin/orders-client';

export default async function OrdersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>
      <OrdersClient />
    </div>
  );
}
