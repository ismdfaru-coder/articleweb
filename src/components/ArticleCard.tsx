
import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
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
