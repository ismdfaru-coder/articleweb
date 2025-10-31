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

export type Admin = {
  username: string;
  password?: string; // Kept optional for backward compatibility if needed, but we will store it now.
  passwordHash?: string; // Keep for potential future use, but we will use password now.
};
