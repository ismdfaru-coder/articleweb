
import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type LatestArticleItemProps = {
  article: Article;
};

export function LatestArticleItem({ article }: LatestArticleItemProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="group grid grid-cols-3 gap-4 items-start border-b pb-4 last:border-b-0">
       <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.imageHint}
          />
        </div>
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
            <Image src={article.authorAvatarUrl} alt={article.author} width={16} height={16} className="rounded-full" />
            <span>{article.author}</span>
        </div>
      </div>
    </Link>
  );
}
