import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';
import { Package, Users, DollarSign, Activity } from 'lucide-react';

// Mock data, to be replaced by API calls to Firebase
const mockStats = {
  totalRevenue: 12345.67,
  newOrders: 12,
  newCustomers: 28,
  totalProducts: 78,
};

const mockRecentOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Olivia Martin',
    customerEmail: 'olivia.martin@email.com',
    date: '2023-11-23',
    status: 'Delivered',
    total: 42.99,
    items: [],
    shippingAddress: ''
  },
  {
    id: 'ORD002',
    customerName: 'Jackson Lee',
    customerEmail: 'jackson.lee@email.com',
    date: '2023-11-22',
    status: 'Shipped',
    total: 89.90,
    items: [],
    shippingAddress: ''
  },
  {
    id: 'ORD003',
    customerName: 'Isabella Nguyen',
    customerEmail: 'isabella.nguyen@email.com',
    date: '2023-11-21',
    status: 'Pending',
    total: 120.00,
    items: [],
    shippingAddress: ''
  },
  {
    id: 'ORD004',
    customerName: 'William Kim',
    customerEmail: 'will@email.com',
    date: '2023-11-20',
    status: 'Delivered',
    total: 75.50,
    items: [],
    shippingAddress: ''
  },
  {
    id: 'ORD005',
    customerName: 'Sophia Garcia',
    customerEmail: 'sophia@email.com',
    date: '2023-11-19',
    status: 'Cancelled',
    total: 30.00,
    items: [],
    shippingAddress: ''
  },
];

const statusVariant = {
  Delivered: 'default',
  Shipped: 'secondary',
  Pending: 'outline',
  Cancelled: 'destructive',
} as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockStats.newOrders}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total active products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockStats.newCustomers}</div>
            <p className="text-xs text-muted-foreground">+5 since last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.customerEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
