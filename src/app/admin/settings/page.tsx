'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import { updateSiteSettings } from '@/app/actions';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    name: '',
    logoUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const siteSettingsRef = doc(db, 'settings', 'siteInfo');
    const unsubscribe = onSnapshot(siteSettingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      } else {
        console.log("No site settings document found. Using defaults.");
        // Initialize with default values if document doesn't exist
        const defaultSettings = { name: 'MRSHOPY', logoUrl: 'https://res.cloudinary.com/ddqzzqnjh/image/upload/v1767286657/hbn0rm8hof8mre3zu0dk.png' };
        setSettings(defaultSettings);
        // Optionally create the document with defaults
        setDoc(siteSettingsRef, defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch site settings:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch site settings.',
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSiteSettings(settings);
      toast({
        title: 'Success!',
        description: 'Site settings have been updated.',
      });
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast({
        title: 'Error',
        description: 'Could not save site settings.',
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
        <h1 className="text-3xl font-bold tracking-tight font-headline">Site Settings</h1>
        <p className="text-muted-foreground">Manage your site's name and logo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Update your site's public name and logo URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              placeholder="e.g., MRSHOPY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              value={settings.logoUrl}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
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
