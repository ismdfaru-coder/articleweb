'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useArticles } from '@/hooks/use-articles';

import type { Article, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Wand2 } from 'lucide-react';
import { OptimizeContentDialog } from './OptimizeContentDialog';
import { saveArticle } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(200, 'Excerpt must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional().default(''),
  author: z.string().min(1, 'Author is required'),
  authorAvatarUrl: z.string().url('Must be a valid URL'),
  categoryId: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof formSchema>;

type ArticleFormProps = {
  article?: Article;
  categories: Category[];
  onSaveSuccess: () => void;
  onCancel: () => void;
};

export function ArticleForm({ article, categories, onSaveSuccess, onCancel }: ArticleFormProps) {
  const [isAiDialogOpen, setAiDialogOpen] = useState(false);
  const { fetchArticles } = useArticles();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const defaultValues: Partial<ArticleFormValues> = article
    ? { ...article, imageHint: article.imageHint || '' }
    : {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/800`,
      imageHint: '',
      author: 'Admin User',
      authorAvatarUrl: `https://picsum.photos/seed/admin/40/40`,
      featured: false,
      categoryId: '',
    };

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: ArticleFormValues) => {
    startTransition(async () => {
      try {
        const saved = await saveArticle(data);
        toast({
          title: `Article ${data.id ? 'updated' : 'created'}`,
          description: `${saved.title} has been successfully saved.`,
        });
        await fetchArticles(); // Refresh the articles list
        onSaveSuccess(); // Close the sheet
      } catch (error) {
        console.error("Failed to save article", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save the article.",
        });
      }
    });
  };
  
  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };

  const currentContent = form.watch('content');
  const [preview, setPreview] = useState(false);

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Article title..." {...field} onBlur={generateSlug} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                   <div className="flex justify-between items-center">
                    <FormLabel>Content</FormLabel>
                    <div className="flex items-center gap-2">
                       <Button type="button" variant="ghost" size="sm" onClick={() => setAiDialogOpen(true)}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Optimize with AI
                      </Button>
                      <Switch checked={preview} onCheckedChange={setPreview} id="preview-switch" />
                      <Label htmlFor="preview-switch">Preview</Label>
                    </div>
                  </div>
                  <FormControl>
                    {preview ? (
                      <div className="prose dark:prose-invert max-w-none rounded-md border p-4 min-h-[400px]" dangerouslySetInnerHTML={{ __html: field.value }} />
                    ) : (
                      <Textarea
                        placeholder="Write your article here... Supports HTML, or paste raw text and save to auto-format."
                        className="min-h-[400px]"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-8">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="article-slug" {...field} />
                  </FormControl>
                  <FormDescription>The URL-friendly version of the title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>                   
                  <FormControl>
                    <Textarea placeholder="A short summary of the article..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorAvatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Article</FormLabel>
                    <FormDescription>
                      Display this article prominently on the homepage.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Article'}
          </Button>
        </div>
      </form>
    </Form>
    <OptimizeContentDialog
        isOpen={isAiDialogOpen}
        setIsOpen={setAiDialogOpen}
        content={currentContent}
        onContentChange={(newContent) => form.setValue('content', newContent, { shouldValidate: true, shouldDirty: true })}
      />
    </>
  );
}
