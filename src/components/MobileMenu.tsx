'use client';
import Link from 'next/link';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import type { Category } from '@/lib/types';

type MobileMenuProps = {
  categories: Category[];
};

export function MobileMenu({ categories }: MobileMenuProps) {
  return (
    <div
      className="h-full w-full bg-white p-6"
    >
      <div className="relative mb-8">
        <Input placeholder="Search Life Reality" className="h-12 text-lg pr-12" />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
      </div>

      <nav className="flex flex-col items-start gap-4">
        <Link href="/" className="font-headline text-xl uppercase tracking-wider text-foreground hover:text-primary">
          Latest
        </Link>
        {categories.map(category => (
          <Link key={category.id} href="#" className="font-headline text-xl uppercase tracking-wider text-foreground hover:text-primary">
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
