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
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Article } from '@/lib/types';
import { ArticleRowActions } from './ArticleRowActions';
import { useEffect, useState, useTransition } from 'react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchArticles = () => {
    startTransition(async () => {
      const articles = await getArticles();
      setArticles(articles);
    });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Re-fetch when the window gets focus
  useEffect(() => {
    const handleFocus = () => fetchArticles();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);


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
            {isPending ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <ArticleRow key={article.id} article={article} />
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
        />
      </TableCell>
    </TableRow>
  )
}
