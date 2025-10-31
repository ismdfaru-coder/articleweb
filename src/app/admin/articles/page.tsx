'use client';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2, MoreHorizontal } from 'lucide-react';
import type { Article } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import * as React from 'react';
import { useArticles } from '@/hooks/use-articles';
import { ArticleForm } from '@/components/admin/ArticleForm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { getCategories } from '@/lib/data';
import type { Category } from '@/lib/types';

function ArticleRowActions({ article, onEdit, onDelete }: { article: Article, onEdit: () => void, onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    setIsAlertOpen(false);
  };

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => setIsAlertOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the article.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function AdminArticlesPage() {
  const { articles, isLoading, deleteArticle: optimisticDelete } = useArticles();
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState<Article | undefined>(undefined);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleNewArticle = () => {
    setEditingArticle(undefined);
    setSheetOpen(true);
  };
  
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingArticle(undefined);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Articles</h1>
        <Button onClick={handleNewArticle}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Article
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <ArticleRow 
                  key={article.id} 
                  article={article} 
                  onEdit={() => handleEditArticle(article)}
                  onDelete={() => optimisticDelete(article.id)}
                />
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

      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-[80vw] lg:max-w-4xl p-0">
          <div className="h-full overflow-y-auto">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="font-headline text-2xl">
                {editingArticle ? 'Edit Article' : 'New Article'}
              </SheetTitle>
              <SheetDescription>
                {editingArticle ? 'Make changes to your article here.' : 'Create a new article to publish.'}
              </SheetDescription>
            </SheetHeader>
            <div className="p-6">
              <ArticleForm 
                article={editingArticle} 
                categories={categories} 
                onSaveSuccess={handleCloseSheet} 
                onCancel={handleCloseSheet}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}

function ArticleRow({ article, onEdit, onDelete }: { article: Article; onEdit: () => void; onDelete: () => void; }) {
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
          article={article}
          onEdit={onEdit}
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  )
}
