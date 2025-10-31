import Image from 'next/image';
import Link from 'next/link';
import { getArticles, getCategories } from '@/lib/data';
import type { Article } from '@/lib/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { LatestArticleItem } from '@/components/LatestArticleItem';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { UserCircle } from 'lucide-react';


export default async function Home() {
  const articles = await getArticles();
  const categories = await getCategories();

  if (!articles.length) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header categories={categories} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 text-center">No articles found.</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const topStory = articles[0];
  const subStories = articles.slice(1, 3);
  const latestStories = articles.slice(3, 8);


  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header categories={categories} />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
            
            {/* Main Content (Left) */}
            <div className="lg:col-span-2">
              <h2 className="section-title">Top Stories</h2>
              <TopStory article={topStory} />
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subStories.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="subStory" />
                ))}
              </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="border-t lg:border-t-0 lg:border-l lg:pl-8 mt-8 lg:mt-0 pt-8 lg:pt-0">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="section-title !mb-0">Latest</h2>
                 <Link href="#" className="text-sm font-bold text-primary hover:underline">See More</Link>
               </div>
               <div className="flex flex-col gap-4">
                {latestStories.map((article) => (
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

function TopStory({ article }: { article: Article }) {
  return (
    <div className="group relative">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden">
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
             <UserCircle className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
