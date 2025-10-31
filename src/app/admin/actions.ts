'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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
  featured: z.preprocess((val) => val === 'on', z.boolean()),
});

export async function saveArticle(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = articleSchema.safeParse(rawData);

  if (!validated.success) {
    console.error(validated.error.flatten().fieldErrors);
    // In a real app, you'd return these errors to the form.
    return { error: 'Invalid data' };
  }

  await dbSaveArticle(validated.data);
  
  revalidatePath('/admin/articles');
  revalidatePath('/');
  revalidatePath(`/articles/${validated.data.slug}`);

  redirect('/admin/articles');
}

export async function deleteArticle(formData: FormData) {
  const id = formData.get('id') as string;
  await dbDeleteArticle(id);
  revalidatePath('/admin/articles');
  revalidatePath('/');
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  if (name) {
    await dbSaveCategory({ name });
    revalidatePath('/admin/categories');
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    await dbDeleteCategory(id);
    revalidatePath('/admin/categories');
  } catch (error) {
    // This will be caught by an error boundary in a real app.
    // For now, it will just prevent the app from crashing.
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
