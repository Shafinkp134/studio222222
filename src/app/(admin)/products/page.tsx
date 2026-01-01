import ProductsClient from '@/components/admin/products-client';
import SeedProducts from '@/components/admin/seed-products';

export default async function ProductsPage() {

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Products</h1>
            <p className="text-muted-foreground">Manage your gift products here.</p>
        </div>
        <SeedProducts />
      </div>
      <ProductsClient />
    </div>
  );
}
