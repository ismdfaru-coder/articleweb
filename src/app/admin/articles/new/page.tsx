import { getCategories } from "@/lib/data";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">New Article</h1>
      <ArticleForm categories={categories} />
    </div>
  );
}
