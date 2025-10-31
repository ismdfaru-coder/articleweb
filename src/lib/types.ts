export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  featured: boolean;
  author: string;
  authorAvatarUrl: string;
  createdAt: string;
  categoryId: string;
  category: Category;
};
