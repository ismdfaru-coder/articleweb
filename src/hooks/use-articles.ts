'use client';

import * as React from 'react';
import {
  getArticles as getArticlesAction,
  saveArticle as saveArticleAction,
  deleteArticle as deleteArticleAction,
} from '@/app/admin/actions';
import type { Article } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useArticles() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchArticles = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedArticles = await getArticlesAction();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching articles',
        description: 'Could not load articles. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const saveArticle = async (
    articleData: Omit<Article, 'id' | 'category' | 'createdAt'> & { id?: string }
  ) => {
    const originalArticles = articles;
    const isUpdating = !!articleData.id;

    // Optimistic update
    if (isUpdating) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleData.id ? { ...a, ...articleData, category: a.category } : a
        )
      );
    } else {
      // For new articles, we can't fully create it on the client
      // so we'll just show a loading state and refetch
      setIsLoading(true);
    }

    try {
      await saveArticleAction(articleData);
      toast({
        title: `Article ${isUpdating ? 'updated' : 'saved'}!`,
        description: `${articleData.title} has been successfully ${isUpdating ? 'updated' : 'saved'}.`,
      });
    } catch (error) {
      console.error('Failed to save article:', error);
      setArticles(originalArticles); // Rollback
      toast({
        variant: 'destructive',
        title: 'Error saving article',
        description: `Could not save article. Please try again.`,
      });
    } finally {
      // Refetch to get the latest state from the server
      await fetchArticles();
    }
  };

  const deleteArticle = async (id: string) => {
    const originalArticles = articles;

    // Optimistic update
    setArticles((prev) => prev.filter((a) => a.id !== id));

    try {
      await deleteArticleAction(id);
      toast({
        title: 'Article deleted!',
        description: 'The article has been successfully removed.',
      });
    } catch (error) {
      console.error('Failed to delete article:', error);
      setArticles(originalArticles); // Rollback
      toast({
        variant: 'destructive',
        title: 'Error deleting article',
        description: 'Could not delete the article. Please try again.',
      });
    }
  };

  return { articles, isLoading, fetchArticles, saveArticle, deleteArticle };
}
