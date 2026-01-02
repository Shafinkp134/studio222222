
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

function CategorySidebar({ categories, activeCategory }: { categories: string[], activeCategory: string | null }) {
  return (
    <aside className="w-full md:w-64 lg:w-72">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="flex flex-col gap-2">
            <Link
              href="/shop"
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                !activeCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              )}
            >
              All Categories
            </Link>
            {categories.map(category => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activeCategory === category ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                )}
              >
                {category}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}


export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();

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

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category));
    return Array.from(uniqueCategories);
  }, [products]);

  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  const categoryQuery = searchParams.get('category') || '';

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchQuery);
      const descriptionMatch = product.description.toLowerCase().includes(searchQuery);
      const categoryMatch = !categoryQuery || product.category === categoryQuery;
      
      return (nameMatch || descriptionMatch) && categoryMatch;
    });
  }, [products, searchQuery, categoryQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <CategorySidebar categories={categories} activeCategory={categoryQuery} />
      <main className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {categoryQuery || 'All Products'}
          </h1>
          <p className="text-muted-foreground">Browse our collection of wonderful gifts.</p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <Link href={`/shop/${product.id}`} className="block relative aspect-[4/3] w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="rounded-t-lg object-cover"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
                  <p className="text-muted-foreground text-sm flex-1 line-clamp-3">{product.description}</p>
                  <p className="text-lg font-bold mt-4">₹{product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/shop/${product.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-lg">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Products Found</h3>
              <p className="text-muted-foreground">Your search or filter returned no results. Try a different one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
