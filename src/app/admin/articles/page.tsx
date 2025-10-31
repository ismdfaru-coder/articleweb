'use client';
import Link from 'next/link';
import { getArticles } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { deleteArticle } from '../actions';
import { PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { use } from 'react';
import type { Article } from '@/lib/types';

export default function AdminArticlesPage() {
  const articles = use(getArticles());

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </TableBody>
        </Table>
      </div>
       {articles.length === 0 && (
         <div className="text-center p-8 text-muted-foreground">No articles found.</div>
       )}
    </div>
  );
}

function ArticleRow({ article }: { article: Article }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <TableRow>
      <TableCell className="font-medium">{article.title}</TableCell>
      <TableCell>{article.category.name}</TableCell>
      <TableCell>
        <Badge variant={article.featured ? 'default' : 'secondary'}>
          {article.featured ? 'Featured' : 'Published'}
        </Badge>
      </TableCell>
      <TableCell>
        {formattedDate}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/articles/edit/${article.id}`}>
                 Edit
              </Link>
            </DropdownMenuItem>
            <form action={deleteArticle}>
               <input type="hidden" name="id" value={article.id} />
               <button type="submit" className="w-full">
                 <DropdownMenuItem>Delete</DropdownMenuItem>
               </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
