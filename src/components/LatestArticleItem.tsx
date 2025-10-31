import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { UserCircle } from 'lucide-react';

type LatestArticleItemProps = {
  article: Article;
};

export function LatestArticleItem({ article }: LatestArticleItemProps) {
    const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });

  return (
    <Link href={`/articles/${article.slug}`} className="group grid grid-cols-3 gap-4 items-start border-b pb-4 last:border-b-0">
      <div className="col-span-2">
        {article.category && (
            <Badge variant="secondary" className="mb-1 text-primary font-bold uppercase text-xs tracking-wider">
                {article.category.name}
            </Badge>
        )}
        <h3 className="font-headline text-md font-bold leading-tight group-hover:text-primary">
          {article.title}
        </h3>
        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span>{formattedDate}</span>
        </div>
      </div>
       <div className="relative aspect-square w-full overflow-hidden">
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
