import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={600}
          height={400}
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={article.imageHint}
        />
      </div>
      <div className="mt-4">
        <Badge variant="secondary">{article.category.name}</Badge>
        <h3 className="font-headline mt-2 text-xl font-bold group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 text-muted-foreground">{article.excerpt}</p>
        <div className="mt-4 flex items-center gap-3">
          <Image
            src={article.authorAvatarUrl}
            alt={article.author}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm font-medium text-muted-foreground">{article.author}</span>
        </div>
      </div>
    </Link>
  );
}
