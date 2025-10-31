'use client';

import Link from "next/link";
import { Menu, Search, X, Instagram, Facebook } from "lucide-react";
import { Button } from "./ui/button";
import type { Category } from "@/lib/types";
import { MobileMenu } from "./MobileMenu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";

export function Header({ categories }: { categories: Category[] }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-headline text-3xl font-extrabold uppercase tracking-tighter border-2 border-black px-2 py-1">Life Reality Insights</span>
          </Link>
          
          {searchOpen ? (
             <div className="flex items-center gap-2 w-full max-w-md">
                <div className="relative flex-grow">
                   <Input placeholder="Search Life Reality" className="pr-10" autoFocus/>
                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                    <X className="h-6 w-6" />
                </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="#" target="_blank">
                       <Instagram className="h-5 w-5" />
                    </Link>
                 </Button>
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="#" target="_blank">
                       <Facebook className="h-5 w-5" />
                    </Link>
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                    <Search className="h-6 w-6" />
                 </Button>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <MobileMenu categories={categories} />
                </SheetContent>
              </Sheet>
            </div>
          )}
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
    </header>
  );
}

function Separator() {
  return <div className="h-px w-full bg-border" />;
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
