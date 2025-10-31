import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-headline text-2xl font-bold text-primary">Life Reality Insights</span>
        </Link>
        <div className="flex items-center gap-4">
           {/* Future nav links can go here */}
           <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
           </Button>
        </div>
      </div>
    </header>
  );
}
