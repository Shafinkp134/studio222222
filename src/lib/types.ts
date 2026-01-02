
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
};

export type Address = {
  fullName: string;
  houseName: string;
  city: string;
  state: string;
  panjayath: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: { productId: string; quantity: number; name: string }[];
  shippingAddress: Address;
  phone?: string;
  transactionId?: string;
  giftWrap?: boolean;
  customerNotes?: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  shippingAddress?: Address;
  phone?: string;
};


export type BannerSettings = {
  text: string;
  enabled: boolean;
};

export type SiteSettings = {
  name: string;
  logoUrl: string;
};
