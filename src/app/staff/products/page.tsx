import ProductsClient from '@/components/admin/products-client';

export default async function StaffProductsPage() {

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Products</h1>
        <p className="text-muted-foreground">Manage your gift products here.</p>
      </div>
      <ProductsClient />
    </div>
  );
}
