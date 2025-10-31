'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import type { Category } from "@/lib/types";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";

export function Header({ categories }: { categories: Category[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-headline text-3xl font-extrabold uppercase tracking-tighter border-2 border-black px-2 py-1">Life Reality Insights</span>
          </Link>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
             </Button>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <Separator />
        <nav className="hidden md:flex h-12 items-center justify-start overflow-x-auto text-sm font-medium">
           <Link href="/" className="px-3 py-2 uppercase tracking-wider text-muted-foreground hover:text-foreground">Latest</Link>
           {categories.map(category => (
             <Link key={category.id} href="#" className="px-3 py-2 uppercase tracking-wider text-muted-foreground hover:text-foreground">
              {category.name}
             </Link>
           ))}
        </nav>
      </div>
      <Separator className="hidden md:block" />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
}

function Separator() {
  return <div className="h-px w-full bg-border" />;
}