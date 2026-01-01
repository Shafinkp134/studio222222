'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, ShoppingCart, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const GIFT_WRAP_COST = 15;

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { productId } = params;

  useEffect(() => {
    if (typeof productId !== 'string') return;

    const fetchProduct = async () => {
      setLoading(true);
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        toast({
          title: 'Product not found',
          description: 'The product you are looking for does not exist.',
          variant: 'destructive',
        });
        router.push('/shop');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId, router, toast]);

  const handlePlaceOrderClick = () => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to place an order.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    setIsOrderDialogOpen(true);
    setShippingAddress('');
    setPhone('');
    setTransactionId('');
    setGiftWrap(false);
    setCustomerNotes('');
  };
  
  const handleConfirmOrder = async () => {
    if (!user || !product) return;

    if (!shippingAddress.trim() || !phone.trim()) {
        toast({
            title: 'Missing Information',
            description: 'Please fill out all required fields.',
            variant: 'destructive',
        });
        return;
    }

    setIsSubmitting(true);
    try {
        const total = product.price + (giftWrap ? GIFT_WRAP_COST : 0);

        const newOrder: Omit<Order, 'id'> = {
            customerName: user.displayName || 'Anonymous',
            customerEmail: user.email || 'no-email',
            date: new Date().toISOString(),
            status: 'Pending',
            total: total,
            items: [{ productId: product.id, name: product.name, quantity: 1 }],
            shippingAddress: shippingAddress,
            phone: phone,
            transactionId: transactionId,
            giftWrap: giftWrap,
            customerNotes: customerNotes,
        };

        await addDoc(collection(db, 'orders'), newOrder);

        toast({
            title: 'Order Placed!',
            description: `${product.name} has been ordered.`,
        });
        setIsOrderDialogOpen(false);
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

  const orderTotal = product ? product.price + (giftWrap ? GIFT_WRAP_COST : 0) : 0;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null; // Or a "Product not found" component
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="relative aspect-[4/3] w-full">
                    <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="rounded-lg object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-headline">{product.name}</h1>
                        <p className="text-2xl font-bold mt-2">₹{product.price.toFixed(2)}</p>
                    </div>
                    <p className="text-lg text-muted-foreground">{product.description}</p>
                    <Button size="lg" className="mt-4" onClick={handlePlaceOrderClick}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Place Order
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
      
       <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription>
              You are about to order {product?.name}. Please confirm the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <h4 className="font-medium">{product?.name}</h4>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Product Price:</p>
                  <p className="text-muted-foreground">₹{product?.price.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Gift Wrap:</p>
                  <p className="text-muted-foreground">₹{giftWrap ? GIFT_WRAP_COST.toFixed(2) : '0.00'}</p>
                </div>
                 <div className="flex justify-between items-center font-medium border-t pt-2 mt-2">
                  <p>Total:</p>
                  <p>₹{orderTotal.toFixed(2)}</p>
                </div>
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
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                <Input
                    id="transactionId"
                    placeholder="Enter transaction ID if you have one"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="customerNotes">Customer Review / Notes (Optional)</Label>
                <Textarea
                    id="customerNotes"
                    placeholder="Add any special instructions or notes for your order."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="gift-wrap" checked={giftWrap} onCheckedChange={(checked) => setGiftWrap(checked as boolean)} />
              <Label htmlFor="gift-wrap" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Add Gift Wrap (+₹{GIFT_WRAP_COST.toFixed(2)})
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>Cancel</Button>
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
