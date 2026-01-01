'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react';
import Link from 'next/link';

export default function PromoBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // sessionStorage is used to remember if the user has closed the banner during their current session.
    const isDismissed = sessionStorage.getItem('promoBannerDismissed');
    if (isDismissed !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('promoBannerDismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Gift className="h-6 w-6" />
            <p className="font-medium">
              <span className="hidden sm:inline">Special Offer!</span> Get 20% off on all items.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <Button size="sm" asChild variant="ghost" className="border border-secondary-foreground/20 hover:bg-secondary/80">
                <Link href="/shop">Shop Now</Link>
             </Button>
             <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleDismiss}
                aria-label="Dismiss"
              >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
