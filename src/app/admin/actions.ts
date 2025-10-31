'use server';

import { revalidateTag } from 'next/cache';
import { 
  saveArticle as dbSaveArticle, 
  deleteArticle as dbDeleteArticle,
  saveCategory as dbSaveCategory,
  deleteCategory as dbDeleteCategory,
  getArticles as dbGetArticles,
} from '@/lib/data';
import { optimizeContent as optimizeContentFlow, type OptimizeContentInput } from '@/ai/flows/optimize-content-for-engagement';
import type { Article } from '@/lib/types';

export async function getArticles() {
  const articles = await dbGetArticles();
  return articles;
}

export async function saveArticle(article: Omit<Article, 'id' | 'category' | 'createdAt'> & { id?: string }): Promise<Article> {
  
  // Auto-format content if it doesn't seem to contain HTML
  if (article.content && !/<[a-z][\s\S]*>/i.test(article.content)) {
    article.content = article.content
      .split(/\n\s*\n/) // Split by one or more blank lines
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('\n');
  }

  const savedArticle = await dbSaveArticle(article);
  revalidateTag('articles');
  return savedArticle;
}

export async function deleteArticle(id: string): Promise<void> {
  await dbDeleteArticle(id);
  revalidateTag('articles');
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  if (name) {
    await dbSaveCategory({ name });
    revalidateTag('categories');
    revalidateTag('articles');
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    await dbDeleteCategory(id);
    revalidateTag('categories');
    revalidateTag('articles');
  } catch (error) {
    console.error(error);
    // In a real app, you'd return this error to the UI
  }
}

export async function optimizeContent(input: OptimizeContentInput) {
  try {
    const result = await optimizeContentFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Optimization Error:', error);
    return { success: false, error: 'Failed to optimize content.' };
  }
}
