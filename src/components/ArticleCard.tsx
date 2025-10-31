
import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ArticleCardProps = {
  article: Article;
  variant?: 'default' | 'compact';
};

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
    const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  if (variant === 'compact') {
     return (
        <Link href={`/articles/${article.slug}`} className="group block">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={article.imageHint}
                />
            </div>
            <div className="mt-4">
                {article.category && <Badge variant="secondary" className="mb-2 text-primary font-bold uppercase text-xs tracking-wider">{article.category.name}</Badge>}
                <h3 className="font-headline text-xl font-bold group-hover:text-primary">
                {article.title}
                </h3>
                 <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Image
                        src={article.authorAvatarUrl}
                        alt={article.author}
                        width={20}
                        height={20}
                        className="rounded-full"
                    />
                    <span>{article.author}</span>
                </div>
            </div>
        </Link>
     )
  }

  return (
    <Link href={`/articles/${article.slug}`} className="group block bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl">
      <div className="relative">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={600}
          height={340}
          className="aspect-video w-full object-cover"
          data-ai-hint={article.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          {article.category && <Badge variant="secondary">{article.category.name}</Badge>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-headline text-lg font-bold group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
      </div>
    </Link>
  );
}
