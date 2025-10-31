
'use server';

import type { Article, Category, Admin } from './types';
import fs from 'fs/promises';
import path from 'path';

// The path to the JSON file that acts as our database
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Db = {
  articles: Article[];
  categories: Category[];
  admin: Admin;
};

// In-memory cache for the database
let cache: Db | null = null;

// --- Read the database file ---
export async function readDb(): Promise<Db> {
  // If cache exists, return it
  if (cache) {
    return cache;
  }

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    cache = JSON.parse(fileContent) as Db;
    return cache;
  } catch (error) {
    // If the file doesn't exist, return a default structure and cache it
    const defaultDb = { articles: [], categories: [], admin: { username: '', passwordHash: '' } };
    cache = defaultDb;
    return cache;
  }
}

// --- Write to the database file ---
async function writeDb(data: Db): Promise<void> {
  // Update the cache first
  cache = data;
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// --- Data Access Functions ---

export const getArticles = async (): Promise<Article[]> => {
  const db = await readDb();
  const articlesWithCategories = db.articles.map(article => {
    const category = db.categories.find(c => c.id === article.categoryId);
    // In a real app, you'd handle the case where category is not found
    return { ...article, category: category! };
  });
  return articlesWithCategories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  const articles = await getArticles();
  return articles.find((a) => a.id === id);
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
};

export const getCategories = async (): Promise<Category[]> => {
  const db = await readDb();
  return db.categories;
};

export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  const categories = await getCategories();
  return categories.find((c) => c.id === id);
};


// --- Data Mutation Functions ---

export const saveArticle = async (article: Omit<Article, 'id' | 'category' | 'createdAt'> & { id?: string }): Promise<Article> => {
  const db = await readDb();
  const category = db.categories.find(c => c.id === article.categoryId);
  if (!category) throw new Error('Category not found');

  if (article.id && db.articles.some(a => a.id === article.id)) {
    // Update existing article
    let updatedArticle: Article | undefined;
    db.articles = db.articles.map(a => {
      if (a.id === article.id) {
        updatedArticle = { ...a, ...article, category };
        return updatedArticle;
      }
      return a;
    });
    if (!updatedArticle) throw new Error('Article not found for update');
    await writeDb({ ...db, articles: db.articles });
    return updatedArticle;
  } else {
    // Create new article
    // Find the highest existing ID and add 1 to guarantee uniqueness
    const maxId = db.articles.reduce((max, a) => Math.max(max, parseInt(a.id, 10)), 0);
    const newId = (maxId + 1).toString();

    const newArticle: Article = {
      ...article,
      id: newId,
      createdAt: new Date().toISOString(),
      category,
    };
    db.articles.push(newArticle);
    await writeDb({ ...db, articles: db.articles });
    return newArticle;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  const db = await readDb();
  const newArticles = db.articles.filter(a => a.id !== id);
  await writeDb({ ...db, articles: newArticles });
};

export const saveCategory = async (category: Omit<Category, 'id' | 'slug'> & { id?: string }): Promise<Category> => {
  const db = await readDb();
  if (category.id) {
    // Update
    const index = db.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      db.categories[index].name = category.name;
      await writeDb(db);
      return db.categories[index];
    }
    throw new Error('Category not found');
  } else {
    // Create
    const maxId = db.categories.reduce((max, c) => Math.max(max, parseInt(c.id, 10)), 0);
    const newId = (maxId + 1).toString();
    const newCategory: Category = {
      id: newId,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
    };
    db.categories.push(newCategory);
    await writeDb(db);
    return newCategory;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  const db = await readDb();
  const articlesWithCategory = db.articles.filter(a => a.categoryId === id);
  if (articlesWithCategory.length > 0) {
    throw new Error('Cannot delete category with associated articles.');
  }
  const newCategories = db.categories.filter(c => c.id !== id);
  await writeDb({ ...db, categories: newCategories });
};
