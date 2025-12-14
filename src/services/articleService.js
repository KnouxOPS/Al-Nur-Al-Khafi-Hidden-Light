import localDB from '@/database';

class ArticleService {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await localDB.init();
    await this.seedInitialData();
    this.initialized = true;
  }

  // --- CRUD Operations ---

  async getAllArticles(options = {}) {
    await this.init();
    try {
      const filters = {
        category: options.category,
        search: options.search,
        status: options.status, // e.g. 'published', 'draft'
        tags: options.tags
      };

      let articles = await localDB.getAllArticles(filters);

      // Sorting
      const sortBy = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder || 'desc';

      articles.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Pagination
      const page = options.page || 1;
      const limit = options.limit || 10;
      const total = articles.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = articles.slice(startIndex, endIndex);

      return {
        articles: paginatedArticles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('ArticleService: Failed to fetch articles', error);
      throw error;
    }
  }

  async getPublishedArticles(options = {}) {
    return this.getAllArticles({ ...options, status: 'published' });
  }

  async getDraftArticles(options = {}) {
    return this.getAllArticles({ ...options, status: 'draft' });
  }

  async getArticleById(id) {
    await this.init();
    try {
      const article = await localDB.getArticle(id);
      if (!article) {
        throw new Error(`Article with ID ${id} not found`);
      }
      return article;
    } catch (error) {
      console.error(`ArticleService: Failed to fetch article ${id}`, error);
      throw error;
    }
  }

  async createArticle(data) {
    await this.init();
    try {
      // Basic validation
      if (!data.title || !data.content) {
        throw new Error('Title and Content are required');
      }

      const status = data.status || 'draft';
      const now = new Date().toISOString();

      const newArticle = {
        id: crypto.randomUUID(),
        title: data.title,
        content: data.content,
        summary: data.summary || this.generateSummary(data.content),
        author: data.author || { name: 'Admin', id: 'admin-1' },
        category: data.category || 'general',
        tags: data.tags || [],
        image: data.image || '/images/default-article.jpg',
        views: 0,
        status: status,
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : null
      };

      await localDB.saveArticle(newArticle);
      return newArticle;
    } catch (error) {
      console.error('ArticleService: Failed to create article', error);
      throw error;
    }
  }

  async updateArticle(id, data) {
    await this.init();
    try {
      const existingArticle = await this.getArticleById(id);
      
      const updatedArticle = {
        ...existingArticle,
        ...data,
        id: existingArticle.id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };

      // Handle status change logic if needed
      if (data.status === 'published' && existingArticle.status !== 'published') {
        updatedArticle.publishedAt = new Date().toISOString();
      }

      await localDB.saveArticle(updatedArticle);
      return updatedArticle;
    } catch (error) {
      console.error(`ArticleService: Failed to update article ${id}`, error);
      throw error;
    }
  }

  async publishArticle(id) {
    return this.updateArticle(id, { 
      status: 'published',
      publishedAt: new Date().toISOString() 
    });
  }

  async unpublishArticle(id) {
    return this.updateArticle(id, { 
      status: 'draft',
      publishedAt: null 
    });
  }

  async deleteArticle(id) {
    await this.init();
    try {
      await localDB.deleteArticle(id);
      return true;
    } catch (error) {
      console.error(`ArticleService: Failed to delete article ${id}`, error);
      throw error;
    }
  }

  // --- Helper Methods ---

  async incrementViewCount(id) {
    try {
      const article = await this.getArticleById(id);
      article.views = (article.views || 0) + 1;
      await localDB.saveArticle(article);
      return article.views;
    } catch (error) {
      // Fail silently for view counts
      console.warn('Failed to increment view count', error);
    }
  }

  async getCategories() {
    await this.init();
    const articles = await localDB.getAllArticles();
    const categories = new Set(articles.map(a => a.category).filter(Boolean));
    return Array.from(categories);
  }

  generateSummary(content, maxLength = 150) {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]*>?/gm, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  }

  // --- Seeding ---

  async seedInitialData() {
    const articles = await localDB.getAllArticles();
    if (articles.length > 0) return;

    console.log('Seeding initial articles...');
    
    const seedData = [
      {
        title: "The Year of the Elephant",
        content: "<p>The Year of the Elephant (ʿĀm al-Fīl) is the name in Islamic history for the year approximately equating to 570 CE. According to Islamic tradition, it was in this year that the Prophet Muhammad ﷺ was born.</p><p>The name is derived from an event said to have occurred at Mecca: Abraha, the Abyssinian Christian ruler of Yemen, marched upon the Ka'bah with a large army, which included war elephants, intending to demolish it. However, the lead elephant, known as Mahmud, is said to have stopped at the boundary around Mecca and refused to enter.</p>",
        summary: "An overview of the Year of the Elephant, marking the birth year of Prophet Muhammad ﷺ.",
        author: { name: "Hidden Light Team", id: "system" },
        category: "biography",
        tags: ["history", "mecca", "birth"],
        status: "published",
        image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800",
        createdAt: new Date(Date.now() - 10000000).toISOString(),
        publishedAt: new Date(Date.now() - 10000000).toISOString()
      },
      {
        title: "The Constitution of Medina",
        content: "<p>The Constitution of Medina (Dustūr al-Madīnah), also known as the Charter of Medina, was drafted by the Islamic prophet Muhammad ﷺ shortly after his arrival at Medina (then known as Yathrib) in 622 CE.</p><p>It constituted a formal agreement between the Prophet ﷺ and all of the significant tribes and families of Yathrib (later known as Medina), including Muslims, Jews, and pagans. It effectively established the first Islamic state.</p>",
        summary: "The historic document that established the first Islamic state and rights for all citizens.",
        author: { name: "Hidden Light Team", id: "system" },
        category: "history",
        tags: ["medina", "law", "peace"],
        status: "published",
        image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=800",
        createdAt: new Date(Date.now() - 5000000).toISOString(),
        publishedAt: new Date(Date.now() - 5000000).toISOString()
      },
      {
        title: "Mercy to the Worlds",
        content: "<p>The Prophet Muhammad ﷺ is described in the Quran as a 'Mercy to the worlds' (Rahmatan lil-'Alamin). His life exemplified compassion not just towards Muslims, but towards people of other faiths, animals, and the environment.</p><p>One famous hadith narrates that a woman was granted Paradise for giving water to a thirsty dog, highlighting the depth of mercy in Islamic teachings.</p>",
        summary: "Exploring the universal mercy and compassion in the character of the Prophet ﷺ.",
        author: { name: "Hidden Light Team", id: "system" },
        category: "ethics",
        tags: ["character", "mercy", "spirituality"],
        status: "published",
        image: "https://images.unsplash.com/photo-1542352668-52c6f66304da?q=80&w=800",
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      }
    ];

    for (const article of seedData) {
      await this.createArticle(article);
    }
  }
}

export default new ArticleService();