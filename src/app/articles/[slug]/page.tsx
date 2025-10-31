import { getArticleBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto max-w-4xl px-4 py-8">
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {article.category.name}
            </Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <Image
                src={article.authorAvatarUrl}
                alt={article.author}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{article.author}</p>
                <p className="text-sm text-muted-foreground">
                  Published on{' '}
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
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
