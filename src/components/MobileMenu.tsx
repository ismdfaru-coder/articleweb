'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, X, Instagram, Facebook, Youtube } from 'lucide-react';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
};

export function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 h-screen w-screen bg-white p-6 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      
      <div className="relative mb-8">
        <Input placeholder="Search Lifehacker" className="h-12 text-lg pr-12" />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
      </div>

      <nav className="flex flex-col items-start gap-4 mb-8">
        <Link href="/" className="font-headline text-xl uppercase tracking-wider text-foreground hover:text-primary" onClick={onClose}>
          Latest
        </Link>
        {categories.map(category => (
          <Link key={category.id} href="#" className="font-headline text-xl uppercase tracking-wider text-foreground hover:text-primary" onClick={onClose}>
            {category.name}
          </Link>
        ))}
      </nav>

      <div className="border-t pt-8">
        <Link href="#" className="font-headline text-sm uppercase tracking-wider text-primary hover:underline mb-6 block">
          # The Difference Between The Dark Web And Deep Web
        </Link>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
                <Link href="#"><Instagram className="h-5 w-5" /></Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <Link href="#"><Facebook className="h-5 w-5" /></Link>
            </Button>
             <Button variant="outline" size="icon" asChild>
                <Link href="#"><Youtube className="h-5 w-5" /></Link>
            </Button>
             <Button variant="outline" size="icon" asChild>
                <Link href="#">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}