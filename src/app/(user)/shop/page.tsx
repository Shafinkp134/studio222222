'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Order } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handlePlaceOrderClick = (product: Product) => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to place an order.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    setSelectedProduct(product);
    setShippingAddress('');
  };
  
  const handleConfirmOrder = async () => {
    if (!user || !selectedProduct) return;

    if (!shippingAddress.trim()) {
        toast({
            title: 'Shipping Address Required',
            description: 'Please enter your shipping address.',
            variant: 'destructive',
        });
        return;
    }

    setIsSubmitting(true);
    try {
        const newOrder: Omit<Order, 'id'> = {
            customerName: user.displayName || 'Anonymous',
            customerEmail: user.email || 'no-email',
            date: new Date().toISOString(),
            status: 'Pending',
            total: selectedProduct.price,
            items: [{ productId: selectedProduct.id, name: selectedProduct.name, quantity: 1 }],
            shippingAddress: shippingAddress,
        };

        await addDoc(collection(db, 'orders'), newOrder);

        toast({
            title: 'Order Placed!',
            description: `${selectedProduct.name} has been ordered.`,
        });
        setSelectedProduct(null);
    } catch (error) {
        console.error('Error placing order:', error);
        toast({
            title: 'Error',
            description: 'Could not place your order. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
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
              <Button className="w-full" onClick={() => handlePlaceOrderClick(product)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Place Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription>
              You are about to order {selectedProduct?.name}. Please confirm the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <h4 className="font-medium">{selectedProduct?.name}</h4>
                <p className="text-muted-foreground">${selectedProduct?.price.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="shipping-address">Shipping Address</Label>
                <Textarea
                    id="shipping-address"
                    placeholder="Enter your full shipping address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>Cancel</Button>
            <Button onClick={handleConfirmOrder} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
