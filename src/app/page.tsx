
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { getArticles } from '@/lib/data';
import { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const recentArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 6);

  if (!articles.length) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 text-center">Loading articles...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}

          <section className="mt-16">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Latest Insights
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(article.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, [article.createdAt]);

  return (
    <section>
      <Link href={`/articles/${article.slug}`} className="group block overflow-hidden rounded-lg">
        <div className="grid md:grid-cols-2 md:gap-8">
          <div className="relative aspect-video">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={article.imageHint}
            />
          </div>
          <div className="mt-4 flex flex-col justify-center md:mt-0">
            <Badge variant="secondary" className="w-fit">
              {article.category.name}
            </Badge>
            <h1 className="font-headline mt-4 text-3xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground md:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
            <div className="mt-6 flex items-center gap-4">
              <Image
                src={article.authorAvatarUrl}
                alt={article.author}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{article.author}</p>
                <p className="text-sm text-muted-foreground">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
