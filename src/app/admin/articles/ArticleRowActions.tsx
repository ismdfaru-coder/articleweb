'use client';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';

export function ArticleRowActions({ articleId, onDelete, isDeleting }: { articleId: string, onDelete: () => void, isDeleting: boolean }) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/articles/edit/${articleId}`}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} disabled={isDeleting} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
