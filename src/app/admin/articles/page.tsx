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
import { useEffect, useState, useTransition, useCallback } from 'react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchArticles = useCallback(() => {
    console.log('Fetching articles...');
    startTransition(() => {
      getArticles().then(data => {
        console.log('Fetched articles:', data.length);
        setArticles(data);
      });
    });
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);
  
  // Re-fetch articles when the window gets focus. This ensures that
  // if the user navigates away (e.g., to the edit page) and comes back,
  // the data is fresh. This is the most reliable way to bypass client-side cache.
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refetching articles.');
      fetchArticles();
    }
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
      // After the action completes, fetch articles again to update the list.
      fetchArticles();
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
    if (confirm('Are you sure you want to delete this article?')) {
      setIsDeleting(true);
      onDelete(article.id);
    }
  }

  // If a global transition is happening (e.g. fetching), but it's not this row's delete,
  // we don't want every row to show a "deleting" state. isDeleting handles this.
  // When the global transition finishes, we can reset our local deleting state.
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
