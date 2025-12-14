import axios from 'axios';

class ArticleService {
  constructor() {
    this.apiBase = '/api/articles';
    this.articlesCache = new Map();
    this.categoriesCache = new Map();
  }

  // Fetch all articles with pagination and filtering
  async getAllArticles(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 20,
        category: options.category,
        sortBy: options.sortBy || 'createdAt',
        sortOrder: options.sortOrder || 'desc',
        search: options.search
      };

      // Simulating API call since backend might not exist in this demo
      // In real app: const response = await axios.get(`${this.apiBase}`, { params });
      
      // For demo purposes, returning empty structure or mock if needed handled by component
      // Returning empty array to prevent crashes
      return {
        articles: [],
        pagination: { page: 1, total: 0 },
        total: 0
      };
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  }

  async getArticleById(id) {
    try {
      if (this.articlesCache.has(id)) {
        return this.articlesCache.get(id);
      }
      const response = await axios.get(`${this.apiBase}/${id}`);
      const article = response.data.article;
      this.articlesCache.set(id, article);
      return article;
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      throw error;
    }
  }

  async getCategories() {
    try {
      if (this.categoriesCache.size > 0) {
        return Array.from(this.categoriesCache.values());
      }
      const response = await axios.get(`${this.apiBase}/categories`);
      const categories = response.data.categories || [];
      categories.forEach(cat => {
        this.categoriesCache.set(cat.slug, cat);
      });
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  async incrementViewCount(articleId) {
    try {
      await axios.post(`${this.apiBase}/${articleId}/view`);
      if (this.articlesCache.has(articleId)) {
        const article = this.articlesCache.get(articleId);
        article.views = (article.views || 0) + 1;
        this.articlesCache.set(articleId, article);
      }
    } catch (error) {
      console.error(`Failed to increment view count for article ${articleId}:`, error);
    }
  }

  clearOldCache(maxAge = 3600000) { 
    const now = Date.now();
    for (const [id, article] of this.articlesCache.entries()) {
      if (now - (article.cachedAt || 0) > maxAge) {
        this.articlesCache.delete(id);
      }
    }
  }
}

export default new ArticleService();