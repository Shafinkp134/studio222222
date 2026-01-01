'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { Product, Order } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsList);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch products:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch products. Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to place an order.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    try {
        const newOrder: Omit<Order, 'id'> = {
            customerName: user.displayName || 'Anonymous',
            customerEmail: user.email || 'no-email',
            date: new Date().toISOString(),
            status: 'Pending',
            total: product.price,
            items: [{ productId: product.id, name: product.name, quantity: 1 }],
            shippingAddress: 'To be confirmed',
        };

        await addDoc(collection(db, 'orders'), newOrder);

        toast({
            title: 'Order Placed!',
            description: `${product.name} has been ordered.`,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        toast({
            title: 'Error',
            description: 'Could not place your order. Please try again.',
            variant: 'destructive',
        });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Shop</h1>
        <p className="text-muted-foreground">Browse our collection of wonderful gifts.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="rounded-t-lg object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
              <p className="text-muted-foreground text-sm flex-1">{product.description}</p>
              <p className="text-lg font-bold mt-4">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart(product)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Place Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
