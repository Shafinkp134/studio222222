'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addProduct } from '@/app/actions';
import { Database } from 'lucide-react';
import type { Product } from '@/lib/types';

const sampleProducts: Omit<Product, 'id'>[] = [
    {
        name: 'Enchanted Rose',
        description: 'A single, perfect rose encased in a glass dome, that magically never wilts. Comes with a soft, warm light.',
        price: 79.99,
        stock: 50,
        category: 'Magical Items',
        imageUrl: 'https://picsum.photos/seed/rose/400/300'
    },
    {
        name: 'Goblin-crafted Silver Locket',
        description: 'A beautiful silver locket known for its intricate design and resistance to tarnishing. It is said to bring good luck.',
        price: 129.99,
        stock: 30,
        category: 'Jewelry',
        imageUrl: 'https://picsum.photos/seed/locket/400/300'
    },
    {
        name: 'Phoenix Feather Quill',
        description: 'A quill made from a phoenix feather. It writes in flames and the ink never runs out.',
        price: 99.99,
        stock: 20,
        category: 'Stationery',
        imageUrl: 'https://picsum.photos/seed/quill/400/300'
    },
    {
        name: 'Dragon Scale Armor Polish',
        description: 'Keep your dragon scale armor shiny and in top condition with this exclusive polish. Also works on regular leather.',
        price: 25.50,
        stock: 100,
        category: 'Adventuring Gear',
        imageUrl: 'https://picsum.photos/seed/polish/400/300'
    },
];

export default function SeedProducts() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSeed = () => {
    startTransition(async () => {
      try {
        for (const product of sampleProducts) {
          await addProduct(product);
        }
        toast({
          title: 'Success!',
          description: 'Sample products have been added to your database.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to seed products.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Button onClick={handleSeed} disabled={isPending} variant="outline">
      <Database className="mr-2 h-4 w-4" />
      {isPending ? 'Seeding...' : 'Seed Products'}
    </Button>
  );
}
