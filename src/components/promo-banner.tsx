'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BannerSettings } from '@/lib/types';

export default function PromoBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<BannerSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bannerSettingsRef = doc(db, 'settings', 'promoBanner');
    const unsubscribe = onSnapshot(bannerSettingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const bannerData = docSnap.data() as BannerSettings;
        setSettings(bannerData);
        const isDismissed = sessionStorage.getItem('promoBannerDismissed');
        if (bannerData.enabled && isDismissed !== 'true') {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      } else {
        setIsOpen(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('promoBannerDismissed', 'true');
    setIsOpen(false);
  };

  if (loading) {
    // You might want a subtle loader or just return null to avoid layout shift
    return null;
  }

  if (!isOpen || !settings || !settings.enabled) {
    return null;
  }

  return (
    <div className="relative bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Gift className="h-6 w-6" />
            <p className="font-medium">
              <span className="hidden sm:inline">{settings.text.split('!')[0]}!</span> {settings.text.split('!')[1]}
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
