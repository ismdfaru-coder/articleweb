'use client';

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import type { Category } from "@/lib/types";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header({ categories }: { categories: Category[] }) {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-headline text-3xl font-extrabold uppercase tracking-tighter border-2 border-black px-2 py-1">Life Reality Insights</span>
          </Link>
          <div className="flex items-center gap-4 md:hidden">
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
