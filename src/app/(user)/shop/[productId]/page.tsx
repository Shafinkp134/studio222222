
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Order, UserProfile, Address } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, ShoppingCart, Gift, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { getUserProfile, updateUserProfile } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const GIFT_WRAP_COST = 15;

type Review = {
    customerName: string;
    customerNotes: string;
};

const initialAddressState: Address = {
    fullName: '',
    houseName: '',
    city: '',
    state: '',
    panjayath: '',
};

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address>(initialAddressState);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { productId } = params;

  useEffect(() => {
    if (typeof productId !== 'string') return;

    const fetchProductAndReviews = async () => {
      setLoading(true);
      setReviewsLoading(true);
      
      // Fetch Product
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

      // Fetch Reviews
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('items', 'array-contains-any', [{productId, name: docSnap.data()?.name, quantity: 1}]),
            orderBy('date', 'desc'),
            limit(10)
        );

        // A more scalable query would be to query a dedicated 'reviews' collection.
        // For this project, we iterate through orders.
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const fetchedReviews: Review[] = [];
        querySnapshot.forEach((doc) => {
            const order = doc.data() as Order;
            const hasProduct = order.items.some(item => item.productId === productId);
            if (hasProduct && order.customerNotes) {
                fetchedReviews.push({
                    customerName: order.customerName,
                    customerNotes: order.customerNotes,
                });
            }
        });

        setReviews(fetchedReviews.slice(0, 10)); // Limit to 10 reviews
      } catch (error) {
        console.error("Error fetching reviews: ", error);
        toast({
            title: 'Could not load reviews',
            description: 'There was an issue fetching customer reviews for this product.',
            variant: 'destructive',
        });
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId, router, toast]);

  const handlePlaceOrderClick = async () => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to place an order.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    
    // Fetch user profile to pre-fill details
    const userProfile = await getUserProfile(user.uid);
    setShippingAddress(userProfile?.shippingAddress || { ...initialAddressState, fullName: user.displayName || '' });
    setPhone(userProfile?.phone || '');

    setIsOrderDialogOpen(true);
    setGiftWrap(false);
    setCustomerNotes('');
  };
  
  const handleConfirmOrder = async () => {
    if (!user || !product) return;

    if (!shippingAddress.fullName || !shippingAddress.houseName || !shippingAddress.city || !shippingAddress.state || !shippingAddress.panjayath || !phone.trim()) {
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
            customerName: shippingAddress.fullName || user.displayName || 'Anonymous',
            customerEmail: user.email || 'no-email',
            date: new Date().toISOString(),
            status: 'Pending',
            total: total,
            items: [{ productId: product.id, name: product.name, quantity: 1 }],
            shippingAddress: shippingAddress,
            phone: phone,
            transactionId: '', // Set as empty for Cash on Delivery
            giftWrap: giftWrap,
            customerNotes: customerNotes,
        };

        await addDoc(collection(db, 'orders'), newOrder);

        // Update user profile with new address and phone
        await updateUserProfile(user.uid, { shippingAddress, phone });

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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({...prev, [name]: value}));
  }

  const orderTotal = product ? product.price + (giftWrap ? GIFT_WRAP_COST : 0) : 0;
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'A';
    const names = name.split(' ');
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : name[0];
  };

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
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>See what other customers are saying about this product.</CardDescription>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(review.customerName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{review.customerName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-primary fill-primary" />)}
                    </div>
                    <p className="text-muted-foreground mt-2">{review.customerNotes}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No reviews yet for this product.</p>
          )}
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
          <ScrollArea className="max-h-[70vh] pr-6">
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
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="houseName">House Name</Label>
                    <Input id="houseName" name="houseName" value={shippingAddress.houseName} onChange={handleAddressChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={shippingAddress.city} onChange={handleAddressChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={shippingAddress.state} onChange={handleAddressChange} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="panjayath">Panchayat</Label>
                    <Input id="panjayath" name="panjayath" value={shippingAddress.panjayath} onChange={handleAddressChange} required />
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
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmOrder} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Order (Cash on Delivery)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
