'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from 'react';
import { BookText, LayoutGrid, Settings, Tag, LogOut } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
   const [authChecked, setAuthChecked] = React.useState(false);


  React.useEffect(() => {
    // This effect runs once on mount to check auth status from localStorage
    try {
        const storedAuth = localStorage.getItem('life-reality-auth');
        if (!storedAuth || !JSON.parse(storedAuth).isAuthenticated) {
            router.push('/login');
        } else {
            setAuthChecked(true);
        }
    } catch (error) {
        console.error("Auth check failed", error);
        router.push('/login');
    }
  }, [router]);

  React.useEffect(() => {
    // This effect runs when the auth state from the hook changes
    if (!isLoading && !isAuthenticated && authChecked) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router, authChecked]);


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading || !authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const isActive = (path: string) => {
    return pathname === path || (path !== '/admin' && pathname.startsWith(path));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                 <BookText className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="font-headline text-lg font-bold text-sidebar-foreground">
                Life Reality Admin
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/articles')}
                  tooltip={{ children: "Articles", side: "right" }}
                >
                  <Link href="/admin/articles">
                    <LayoutGrid />
                    <span>Articles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/categories')}
                  tooltip={{ children: "Categories", side: "right" }}
                >
                  <Link href="/admin/categories">
                    <Tag />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span>Admin User</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="max-w-full flex-1 overflow-y-auto">
          <header className="flex h-14 items-center justify-between border-b bg-background px-4">
             <SidebarTrigger />
             <Link href="/" className="text-sm font-medium hover:underline">
                View Site
             </Link>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
