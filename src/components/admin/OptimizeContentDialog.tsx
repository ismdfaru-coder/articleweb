'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { optimizeContent } from '@/app/admin/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { OptimizeContentOutput } from '@/ai/flows/optimize-content-for-engagement';

const formSchema = z.object({
  targetAudience: z.string().min(1, 'Target audience is required'),
  websiteType: z.string().min(1, 'Website type is required'),
});

type OptimizeFormValues = z.infer<typeof formSchema>;

type OptimizeContentDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: string;
  onContentChange: (newContent: string) => void;
};

export function OptimizeContentDialog({
  isOpen,
  setIsOpen,
  content,
  onContentChange,
}: OptimizeContentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizeContentOutput | null>(null);
  
  const form = useForm<OptimizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetAudience: 'General audience',
      websiteType: 'Informational blog',
    }
  });

  const handleOptimize = async (values: OptimizeFormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await optimizeContent({
      contentBlock: content,
      ...values,
    });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }

    setIsLoading(false);
  };
  
  const handleApplyChanges = () => {
    if (result?.optimizedContent) {
      onContentChange(result.optimizedContent);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state on close after a small delay
    setTimeout(() => {
      setIsLoading(false);
      setError(null);
      setResult(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Wand2 className="h-6 w-6" />
            Optimize Content with AI
          </DialogTitle>
          <DialogDescription>
            Improve engagement by optimizing content and layout for your target audience.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <form onSubmit={form.handleSubmit(handleOptimize)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input id="targetAudience" {...form.register('targetAudience')} />
                {form.formState.errors.targetAudience && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.targetAudience.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="websiteType">Website Type</Label>
                <Input id="websiteType" {...form.register('websiteType')} />
                 {form.formState.errors.websiteType && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.websiteType.message}</p>
                )}
              </div>
            </div>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? 'Optimizing...' : 'Optimize'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-1">
              <div>
                <h3 className="font-headline font-semibold mb-2">Original Content</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-4" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
              <div>
                <h3 className="font-headline font-semibold mb-2">✨ Optimized Content</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-primary p-4" dangerouslySetInnerHTML={{ __html: result.optimizedContent }} />
              </div>
            </div>
             <Alert className="mt-4">
              <Sparkles className="h-4 w-4" />
              <AlertTitle className="font-headline">AI Explanation</AlertTitle>
              <AlertDescription>
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.explanation }} />
              </AlertDescription>
            </Alert>
            <DialogFooter className="mt-4">
               <Button type="button" variant="outline" onClick={() => setResult(null)}>Back</Button>
               <Button onClick={handleApplyChanges}>Apply Changes</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
