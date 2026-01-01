'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { BannerSettings } from '@/lib/types';
import { updateBannerSettings } from '@/app/actions';

export default function BannerPage() {
  const [settings, setSettings] = useState<BannerSettings>({
    text: '',
    enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const bannerSettingsRef = doc(db, 'settings', 'promoBanner');
    const unsubscribe = onSnapshot(bannerSettingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as BannerSettings);
      } else {
        // If the document doesn't exist, you might want to initialize it
        console.log("No banner settings document found. Using defaults.");
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch banner settings:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch banner settings.',
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBannerSettings(settings);
      toast({
        title: 'Success!',
        description: 'Banner settings have been updated.',
      });
    } catch (error) {
      console.error('Error updating banner:', error);
      toast({
        title: 'Error',
        description: 'Could not save banner settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Banner Management</h1>
        <p className="text-muted-foreground">Control the promotional banner shown to users.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banner Settings</CardTitle>
          <CardDescription>
            Use the form below to update the banner text and toggle its visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="banner-text">Banner Text</Label>
            <Input
              id="banner-text"
              value={settings.text}
              onChange={(e) => setSettings({ ...settings, text: e.target.value })}
              placeholder="e.g., Special Offer! Get 20% off."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="banner-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
            <Label htmlFor="banner-enabled">Enable Banner</Label>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
