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
import { PlusCircle } from 'lucide-react';
import type { Article } from '@/lib/types';
import { ArticleRowActions } from './ArticleRowActions';
import { useEffect, useState, useTransition } from 'react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchArticles = React.useCallback(() => {
    startTransition(() => {
      getArticles().then(setArticles);
    });
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);
  
  // Re-fetch articles when the window gets focus. This ensures that
  // if the user navigates away and comes back, the data is fresh.
  useEffect(() => {
    const handleFocus = () => fetchArticles();
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchArticles]);


  const handleDelete = (id: string) => {
    const formData = new FormData();
    formData.append('id', id);
    startTransition(async () => {
      await deleteArticle(formData);
      fetchArticles(); // Refetch after delete
    });
  }

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
              <ArticleRow key={article.id} article={article} onDelete={handleDelete} isPending={isPending}/>
            ))}
          </TableBody>
        </Table>
      </div>
       {articles.length === 0 && !isPending && (
         <div className="text-center p-8 text-muted-foreground">No articles found.</div>
       )}
       {isPending && articles.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">Loading articles...</div>
       )}
    </div>
  );
}

function ArticleRow({ article, onDelete, isPending }: { article: Article, onDelete: (id: string) => void, isPending: boolean }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(article.id);
  }

  // If a transition is happening, but it's not this row's delete, don't show deleting state.
  useEffect(() => {
    if (!isPending) {
      setIsDeleting(false);
    }
  }, [isPending]);

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
        {formattedDate}
      </TableCell>
      <TableCell>
        <ArticleRowActions 
          articleId={article.id} 
          onDelete={handleDelete} 
          isDeleting={isDeleting}
        />
      </TableCell>
    </TableRow>
  )
}
