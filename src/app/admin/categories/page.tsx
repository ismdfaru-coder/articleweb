import { getCategories } from '@/lib/data';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteCategory, createCategory } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="font-headline text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-2">Manage your article categories.</p>
        <div className="mt-6 rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <Button type="submit" variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {categories.length === 0 && (
             <div className="text-center p-8 text-muted-foreground">No categories found.</div>
           )}
        </div>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" placeholder="e.g., Technology" required />
              </div>
              <Button type="submit">Create Category</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
