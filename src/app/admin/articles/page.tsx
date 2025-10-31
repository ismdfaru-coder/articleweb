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
import { PlusCircle, Trash2, FilePenLine } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState }from 'react';
import type { Article } from '@/lib/types';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({});

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      const dates = articles.reduce((acc, article) => {
        acc[article.id] = new Date(article.createdAt).toLocaleDateString();
        return acc;
      }, {} as {[key: string]: string});
      setFormattedDates(dates);
    }
  }, [articles]);

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
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.category.name}</TableCell>
                <TableCell>
                  <Badge variant={article.featured ? 'default' : 'secondary'}>
                    {article.featured ? 'Featured' : 'Published'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formattedDates[article.id] || '...'}
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
