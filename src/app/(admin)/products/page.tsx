import type { Product } from '@/lib/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductsClient from '@/components/admin/products-client';

async function getProducts(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCol);
    const productsList = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    return productsList;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const initialProducts = await getProducts();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Products</h1>
        <p className="text-muted-foreground">Manage your gift products here.</p>
      </div>
      <ProductsClient initialProducts={initialProducts} />
    </div>
  );
}
