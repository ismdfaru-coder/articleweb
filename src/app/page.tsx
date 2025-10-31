import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/data';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { LatestArticleItem } from '@/components/LatestArticleItem';

export default async function Home() {
  const articles = await getArticles();

  if (!articles.length) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 text-center">No articles found.</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const topStory = articles[0];
  const secondaryTopStories = articles.slice(1, 3);
  const latestArticles = articles.slice(3, 8);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-900">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">

            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary w-fit pb-1 mb-4">
                Top Stories
              </h2>
              {topStory && <FeaturedArticle article={topStory} />}

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {secondaryTopStories.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary w-fit pb-1 mb-4 mt-8 lg:mt-0">
                Latest
              </h2>
              <div className="flex flex-col gap-4">
                {latestArticles.map((article) => (
                  <LatestArticleItem key={article.id} article={article} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.imageHint}
            priority
          />
        </div>
        <div className="mt-4">
          {article.category && (
            <Badge variant="secondary" className="mb-2 text-primary font-bold uppercase text-xs tracking-wider">
              {article.category.name}
            </Badge>
          )}
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground/90 group-hover:text-primary md:text-4xl">
            {article.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
             <Image
                src={article.authorAvatarUrl}
                alt={article.author}
                width={24}
                height={24}
                className="rounded-full"
              />
            <span>{article.author}</span>
            <span>&middot;</span>
            <time dateTime={article.createdAt}>{formattedDate}</time>
          </div>
        </div>
      </Link>
    </div>
  );
}
