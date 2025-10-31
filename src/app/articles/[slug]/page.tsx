import { getArticleBySlug, getCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { Article } from '@/lib/types';

type ArticlePageProps = {
  params: { slug: string };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  const categories = await getCategories();

  if (!article) {
    notFound();
  }
  
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const authorName = "Admin User";
  const authorAvatar = "https://picsum.photos/seed/admin/40/40";

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <main className="flex-1">
        <article className="container mx-auto max-w-4xl px-4 py-8">
          <header className="mb-8">
            {article.category && (
              <Badge variant="secondary" className="mb-4">
                {article.category.name}
              </Badge>
            )}
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <Image
                src={authorAvatar}
                alt={authorName}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{authorName}</p>
                <p className="text-sm text-muted-foreground">
                  Published on {formattedDate}
                </p>
              </div>
            </div>
          </header>

          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              data-ai-hint={article.imageHint}
              priority
            />
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none space-y-4 font-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
