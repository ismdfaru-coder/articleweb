'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { 
  saveArticle as dbSaveArticle, 
  deleteArticle as dbDeleteArticle,
  saveCategory as dbSaveCategory,
  deleteCategory as dbDeleteCategory
} from '@/lib/data';
import { optimizeContent as optimizeContentFlow, type OptimizeContentInput } from '@/ai/flows/optimize-content-for-engagement';

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  slug: z.string().min(1, 'Slug is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  authorAvatarUrl: z.string().url('Must be a valid URL'),
  categoryId: z.string().min(1, 'Category is required'),
  featured: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});

export async function saveArticle(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = articleSchema.safeParse(rawData);

  if (!validated.success) {
    console.error(validated.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid data' };
  }

  const savedArticle = await dbSaveArticle(validated.data);
  
  revalidateTag('articles');
  revalidatePath('/admin/articles');
  revalidatePath('/');
  revalidatePath(`/articles/${validated.data.slug}`);

  return { success: true, data: savedArticle };
}

export async function deleteArticle(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  await dbDeleteArticle(id);
  revalidateTag('articles');
  revalidatePath('/admin/articles');
  revalidatePath('/');
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  if (name) {
    await dbSaveCategory({ name });
    revalidateTag('categories');
    revalidatePath('/admin/articles/new');
    revalidatePath('/admin/articles/edit/.*'); // Revalidate all edit pages
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    await dbDeleteCategory(id);
    revalidateTag('categories');
    revalidatePath('/admin/categories');
  } catch (error) {
    console.error(error);
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
