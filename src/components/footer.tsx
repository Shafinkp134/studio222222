import Link from 'next/link';
import { Logo } from './logo';
import { Instagram } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <p className="font-headline text-lg font-semibold">MRSHOPY</p>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href="https://instagram.com/shafin.k.p"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shafin
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary">
                Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
            </Link>
            <Link href="https://wa.me/918590814673" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                Support
            </Link>
            <div className="flex items-center gap-2">
                <a href="https://instagram.com/shafin.k.p" target="_blank" rel="noreferrer">
                    <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
}
