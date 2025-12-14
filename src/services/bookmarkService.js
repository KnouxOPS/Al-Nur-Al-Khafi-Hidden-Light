import localDB from '@/database';

class BookmarkService {
  constructor() {
    this.bookmarksCache = new Map();
    this.readLaterCache = new Map();
  }

  // Add to favorites
  async addToFavorites(item) {
    try {
      const favorite = {
        id: `fav_${this.generateId()}`,
        ...item,
        addedAt: new Date().toISOString(),
        type: item.type || 'article'
      };

      await localDB.saveUserData(`favorite_${favorite.id}`, favorite);
      
      this.bookmarksCache.set(favorite.id, favorite);
      
      return favorite;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      throw error;
    }
  }

  // Remove from favorites
  async removeFromFavorites(favoriteId) {
    try {
      await localDB.saveUserData(`favorite_${favoriteId}`, null);
      
      this.bookmarksCache.delete(favoriteId);
      
      return true;
    } catch (error) {
      console.error(`Failed to remove from favorites ${favoriteId}:`, error);
      throw error;
    }
  }

  // Get favorites
  async getFavorites(userId, options = {}) {
    try {
      const cacheKey = `favorites_${userId}_${JSON.stringify(options)}`;
      
      if (this.bookmarksCache.has(cacheKey)) {
        return this.bookmarksCache.get(cacheKey);
      }

      const favorites = await this.fetchFavoritesFromDB(userId, options);
      
      this.bookmarksCache.set(cacheKey, favorites);
      setTimeout(() => {
        this.bookmarksCache.delete(cacheKey);
      }, 300000);

      return favorites;
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      return { items: [], pagination: { page: 1, totalPages: 0, total: 0 } };
    }
  }

  // Simulate favorites fetch
  async fetchFavoritesFromDB(userId, options) {
    const mockFavorites = [
      {
        id: 'fav_1',
        title: 'مولد النبي محمد ﷺ',
        type: 'article',
        addedAt: new Date(Date.now() - 86400000).toISOString(),
        category: 'biography'
      },
      {
        id: 'fav_2',
        title: 'حديث: إنما الأعمال بالنيات',
        type: 'hadith',
        addedAt: new Date(Date.now() - 172800000).toISOString(),
        category: 'wisdom'
      }
    ];

    let filtered = mockFavorites;
    
    if (options.type) {
      filtered = filtered.filter(f => f.type === options.type);
    }
    
    filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    
    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = filtered.slice(startIndex, endIndex);
    
    return {
      items: paginated,
      pagination: {
        page: page,
        totalPages: Math.ceil(filtered.length / limit),
        total: filtered.length
      }
    };
  }

  // Check if item is favorited
  async isInFavorites(itemId, userId) {
    try {
      const favorites = await this.getFavorites(userId);
      return favorites.items.some(f => f.itemId === itemId);
    } catch (error) {
      console.error('Failed to check if item is in favorites:', error);
      return false;
    }
  }

  // Add to read later
  async addToReadLater(item) {
    try {
      const readLaterItem = {
        id: `readlater_${this.generateId()}`,
        ...item,
        addedAt: new Date().toISOString(),
        read: false,
        type: item.type || 'article'
      };

      await localDB.saveUserData(`readlater_${readLaterItem.id}`, readLaterItem);
      
      this.readLaterCache.set(readLaterItem.id, readLaterItem);
      
      return readLaterItem;
    } catch (error) {
      console.error('Failed to add to read later:', error);
      throw error;
    }
  }

  // Remove from read later
  async removeFromReadLater(itemId) {
    try {
      await localDB.saveUserData(`readlater_${itemId}`, null);
      
      this.readLaterCache.delete(itemId);
      
      return true;
    } catch (error) {
      console.error(`Failed to remove from read later ${itemId}:`, error);
      throw error;
    }
  }

  // Get read later list
  async getReadLaterList(userId, options = {}) {
    try {
      const cacheKey = `readlater_${userId}_${JSON.stringify(options)}`;
      
      if (this.readLaterCache.has(cacheKey)) {
        return this.readLaterCache.get(cacheKey);
      }

      const readLaterItems = await this.fetchReadLaterFromDB(userId, options);
      
      this.readLaterCache.set(cacheKey, readLaterItems);
      
      return readLaterItems;
    } catch (error) {
      console.error('Failed to fetch read later list:', error);
      return { items: [], pagination: { page: 1, totalPages: 0, total: 0 } };
    }
  }

  // Simulate read later fetch
  async fetchReadLaterFromDB(userId, options) {
    const mockReadLater = [
      {
        id: 'readlater_1',
        title: 'الهجرة النبوية',
        type: 'article',
        addedAt: new Date(Date.now() - 43200000).toISOString(),
        read: false,
        category: 'history'
      }
    ];

    let filtered = mockReadLater;
    
    if (options.read !== undefined) {
      filtered = filtered.filter(item => item.read === options.read);
    }
    
    filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    
    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = filtered.slice(startIndex, endIndex);
    
    return {
      items: paginated,
      pagination: {
        page: page,
        totalPages: Math.ceil(filtered.length / limit),
        total: filtered.length
      }
    };
  }

  // Mark as read
  async markAsRead(itemId) {
    try {
      const item = await localDB.getUserData(`readlater_${itemId}`);
      if (item) {
        item.read = true;
        item.readAt = new Date().toISOString();
        
        await localDB.saveUserData(`readlater_${itemId}`, item);
        
        this.readLaterCache.set(itemId, item);
        
        return item;
      }
      return null;
    } catch (error) {
      console.error(`Failed to mark item ${itemId} as read:`, error);
      throw error;
    }
  }

  // Clear read items
  async clearReadItems(userId) {
    try {
      const readLaterList = await this.getReadLaterList(userId);
      const readItems = readLaterList.items.filter(item => item.read);
      
      for (const item of readItems) {
        await localDB.saveUserData(`readlater_${item.id}`, null);
        this.readLaterCache.delete(item.id);
      }
      
      return readItems.length;
    } catch (error) {
      console.error('Failed to clear read items:', error);
      throw error;
    }
  }

  // Get stats
  async getStats(userId) {
    try {
      const favorites = await this.getFavorites(userId);
      const readLater = await this.getReadLaterList(userId);
      
      return {
        favoritesCount: favorites.pagination.total,
        readLaterCount: readLater.pagination.total,
        unreadCount: readLater.items.filter(item => !item.read).length
      };
    } catch (error) {
      console.error('Failed to get bookmark stats:', error);
      return { favoritesCount: 0, readLaterCount: 0, unreadCount: 0 };
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async syncWithCloud(userId) {
    try {
      console.log('Syncing bookmarks with cloud...');
      return true;
    } catch (error) {
      console.error('Failed to sync with cloud:', error);
      return false;
    }
  }
}

export default new BookmarkService();