import { getArticleById, getCategories } from "@/lib/data";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { notFound } from "next/navigation";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, categories] = await Promise.all([
    getArticleById(params.id),
    getCategories(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">Edit Article</h1>
      <ArticleForm article={article} categories={categories} />
    </div>
  );
}
