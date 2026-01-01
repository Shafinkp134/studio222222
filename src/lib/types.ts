export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: { productId: string; quantity: number; name: string }[];
  shippingAddress: string;
  phone?: string;
  transactionId?: string;
  giftWrap?: boolean;
  customerNotes?: string;
};

export type BannerSettings = {
  text: string;
  enabled: boolean;
};
