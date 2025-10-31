'use client';
import Link from 'next/link';
import * as React from 'react';
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
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useTransition } from 'react';
import type { Article } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);
  
  const handleDeleteArticle = (id: string) => {
    const formData = new FormData();
    formData.append('id', id);

    startTransition(async () => {
      await deleteArticle(formData);
      // Re-fetch articles after deletion
      const updatedArticles = await getArticles();
      setArticles(updatedArticles);
    });
  };

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

      <div className="mt-6 rounded-lg border shadow-sm overflow-x-auto">
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
              <ArticleRow key={article.id} article={article} onDelete={handleDeleteArticle} isPending={isPending} />
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

function ArticleRow({ article, onDelete, isPending }: { article: Article, onDelete: (id: string) => void, isPending: boolean }) {
  const [isClient, setIsClient] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const formattedDate = isClient ? new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';


  return (
    <TableRow>
      <TableCell className="font-medium">{article.title}</TableCell>
      <TableCell>{article.category?.name || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant={article.featured ? 'default' : 'secondary'}>
          {article.featured ? 'Featured' : 'Published'}
        </Badge>
      </TableCell>
      <TableCell>
        {isClient ? formattedDate : <div className="h-5 bg-muted w-24 rounded-md animate-pulse" /> }
      </TableCell>
      <TableCell>
         <form ref={formRef} action={() => onDelete(article.id)} className="hidden">
            <input type="hidden" name="id" value={article.id} />
        </form>
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
             <DropdownMenuItem onClick={() => formRef.current?.requestSubmit()} disabled={isPending} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                {isPending ? 'Deleting...' : 'Delete'}
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
