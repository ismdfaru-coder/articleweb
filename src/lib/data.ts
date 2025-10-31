'use server';

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import type { Article, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';

// In a real application, this data would be in a database.
let categories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Productivity', slug: 'productivity' },
  { id: '3', name: 'Culture', slug: 'culture' },
  { id: '4', name: 'Personal Growth', slug: 'personal-growth' },
];

let articles: Article[] = [
  {
    id: '1',
    slug: 'the-future-of-ai-in-software-development',
    title: 'The Future of AI in Software Development',
    excerpt: 'Exploring how artificial intelligence is reshaping the landscape of coding, testing, and deployment.',
    content: `
      <p>Artificial Intelligence (AI) is no longer a futuristic concept but a present-day reality transforming industries, and software development is no exception. From automated code generation to intelligent testing and deployment pipelines, AI is poised to revolutionize how we build software.</p>
      <h2 class="font-headline text-2xl font-bold my-4">AI-Powered Coding Assistants</h2>
      <p>Tools like GitHub Copilot are already augmenting developers' capabilities, suggesting entire functions and code blocks in real-time. This not only speeds up development but also helps developers learn new patterns and APIs. As these tools become more sophisticated, they could handle more complex logic, freeing up developers to focus on architecture and problem-solving.</p>
      <h2 class="font-headline text-2xl font-bold my-4">Intelligent Testing and Debugging</h2>
      <p>AI algorithms can analyze codebases to predict where bugs are most likely to occur. They can generate intelligent test cases that cover edge cases humans might miss. When bugs do appear, AI can analyze stack traces and suggest potential fixes, drastically reducing debugging time.</p>
      <blockquote class="border-l-4 border-primary pl-4 italic my-4">"The goal is not to replace developers, but to empower them with tools that handle the repetitive and predictable, so they can focus on the creative and innovative."</blockquote>
      <p>The integration of AI into the software development lifecycle is not just an efficiency boost; it's a paradigm shift. It promises a future where software is more robust, secure, and delivered faster than ever before. The key will be for developers to embrace these tools and adapt their workflows to leverage the full potential of their new AI partners.</p>
    `,
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint,
    featured: false,
    author: 'Alex Innovate',
    authorAvatarUrl: 'https://picsum.photos/seed/author1/40/40',
    createdAt: '2024-07-20T10:00:00Z',
    categoryId: '1',
    category: { id: '1', name: 'Technology', slug: 'technology' },
  },
  {
    id: '2',
    slug: 'mastering-deep-work-in-a-distracted-world',
    title: 'Mastering Deep Work in a Distracted World',
    excerpt: 'Techniques and strategies to cultivate intense focus and produce high-quality work in an age of constant interruptions.',
    content: '<p>Deep work is becoming a superpower in our increasingly distracted digital economy. This article explores how to achieve it.</p>',
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint,
    featured: false,
    author: 'Samantha Focus',
    authorAvatarUrl: 'https://picsum.photos/seed/author2/40/40',
    createdAt: '2024-07-19T14:30:00Z',
    categoryId: '2',
    category: { id: '2', name: 'Productivity', slug: 'productivity' },
  },
  {
    id: '3',
    slug: 'the-renaissance-of-vinyl-and-analog-media',
    title: 'The Renaissance of Vinyl and Analog Media',
    excerpt: 'Why are tangible formats like records and film making a comeback in our digital-first culture?',
    content: '<p>In an age of streaming, the tactile experience of vinyl records is attracting a new generation of audiophiles.</p>',
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint,
    featured: false,
    author: 'Chloe Groove',
    authorAvatarUrl: 'https://picsum.photos/seed/author3/40/40',
    createdAt: '2024-07-18T09:00:00Z',
    categoryId: '3',
    category: { id: '3', name: 'Culture', slug: 'culture' },
  },
  {
    id: '4',
    slug: 'the-stoics-guide-to-a-resilient-mind',
    title: "The Stoic's Guide to a Resilient Mind",
    excerpt: 'Applying ancient wisdom to modern-day challenges for a more tranquil and purposeful life.',
    content: '<p>Stoicism offers timeless advice for building mental fortitude. Let\'s explore some key principles.</p>',
    imageUrl: PlaceHolderImages[3].imageUrl,
imageHint: PlaceHolderImages[3].imageHint,
    featured: false,
    author: 'Marcus Aurelius Jr.',
    authorAvatarUrl: 'https://picsum.photos/seed/author4/40/40',
    createdAt: '2024-07-17T18:00:00Z',
    categoryId: '4',
    category: { id: '4', name: 'Personal Growth', slug: 'personal-growth' },
  },
  {
    id: '5',
    slug: 'sustainable-tech-innovations-shaping-our-future',
    title: 'Sustainable Tech: Innovations Shaping Our Future',
    excerpt: 'From green data centers to biodegradable circuits, tech is getting an eco-friendly makeover.',
    content: '<p>The tech industry is tackling its environmental footprint with groundbreaking sustainable solutions.</p>',
    imageUrl: PlaceHolderImages[4].imageUrl,
    imageHint: PlaceHolderImages[4].imageHint,
    featured: false,
author: 'Alex Innovate',
    authorAvatarUrl: 'https://picsum.photos/seed/author1/40/40',
    createdAt: '2024-07-16T11:00:00Z',
    categoryId: '1',
    category: { id: '1', name: 'Technology', slug: 'technology' },
  },
  {
    id: '6',
    slug: 'the-pomodoro-technique-reimagined',
    title: 'The Pomodoro Technique, Reimagined',
    excerpt: 'Beyond the 25-minute timer: adapting a classic productivity method for the modern creative workflow.',
    content: '<p>The Pomodoro Technique is a classic, but how can we update it for the 21st-century knowledge worker?</p>',
    imageUrl: PlaceHolderImages[5].imageUrl,
    imageHint: PlaceHolderImages[5].imageHint,
    featured: false,
    author: 'Samantha Focus',
    authorAvatarUrl: 'https://picsum.photos/seed/author2/40/40',
    createdAt: '2024-07-15T16:20:00Z',
    categoryId: '2',
    category: { id: '2', name: 'Productivity', slug: 'productivity' },
  },
];

// Functions to simulate fetching data
export const getArticles = async (): Promise<Article[]> => {
  // Add category object to each article
  const articlesWithCategories = articles.map(article => {
    const category = categories.find(c => c.id === article.categoryId);
    return { ...article, category: category! };
  });
  return articlesWithCategories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  const article = articles.find((a) => a.id === id);
  if (article) {
    const category = categories.find(c => c.id === article.categoryId);
    return { ...article, category: category! };
  }
  return undefined;
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  const article = articles.find((a) => a.slug === slug);
  if (article) {
    const category = categories.find(c => c.id === article.categoryId);
    return { ...article, category: category! };
  }
  return undefined;
};

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    return categories;
  },
  ['categories'],
  { tags: ['categories'] }
);

export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  return (await getCategories()).find((c) => c.id === id);
};

// Functions to simulate writing data
export const saveArticle = async (article: Omit<Article, 'id' | 'category' | 'createdAt'> & { id?: string }): Promise<Article> => {
  const allCategories = await getCategories();
  const category = allCategories.find(c => c.id === article.categoryId);
  if (!category) throw new Error('Category not found');

  if (article.id) {
    // Update existing article
    const index = articles.findIndex(a => a.id === article.id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...article, category };
      return articles[index];
    }
    throw new Error('Article not found');
  } else {
    // Create new article
    const newArticle: Article = {
      ...article,
      id: (articles.length + 1).toString(),
      createdAt: new Date().toISOString(),
      category,
    };
    articles.push(newArticle);
    return newArticle;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  articles = articles.filter(a => a.id !== id);
};

export const saveCategory = async (category: Omit<Category, 'id' | 'slug'> & { id?: string }): Promise<Category> => {
  if (category.id) {
    // Update
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index].name = category.name;
      return categories[index];
    }
    throw new Error('Category not found');
  } else {
    // Create
    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
    };
    categories.push(newCategory);
    return newCategory;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  // Check if any articles use this category
  const articlesWithCategory = articles.filter(a => a.categoryId === id);
  if (articlesWithCategory.length > 0) {
    throw new Error('Cannot delete category with associated articles.');
  }
  categories = categories.filter(c => c.id !== id);
};
