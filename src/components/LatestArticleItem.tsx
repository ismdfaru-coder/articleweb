import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type LatestArticleItemProps = {
  article: Article;
};

export function LatestArticleItem({ article }: LatestArticleItemProps) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/articles/${article.slug}`} className="group grid grid-cols-3 gap-4 items-center border-b pb-4">
      <div className="col-span-2">
        {article.category && (
            <Badge variant="secondary" className="mb-2 text-primary font-bold uppercase text-xs tracking-wider">
                {article.category.name}
            </Badge>
        )}
        <h3 className="font-headline text-md font-bold leading-tight group-hover:text-primary">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
      </div>
       <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.imageHint}
          />
        </div>
    </Link>
  );
}
