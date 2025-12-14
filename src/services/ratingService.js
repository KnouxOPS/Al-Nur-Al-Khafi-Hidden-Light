import localDB from '@/database';

class RatingService {
  constructor() {
    this.ratingsCache = new Map();
  }

  // Rate an article
  async rateArticle(articleId, rating, userId) {
    try {
      const ratingData = {
        id: `${userId}_${articleId}`,
        userId,
        articleId,
        rating,
        createdAt: new Date().toISOString()
      };

      // Save rating
      await localDB.saveUserData(`rating_${ratingData.id}`, ratingData);
      
      // Update average
      await this.updateArticleAverageRating(articleId);
      
      // Update cache
      this.ratingsCache.set(ratingData.id, ratingData);
      
      return ratingData;
    } catch (error) {
      console.error(`Failed to rate article ${articleId}:`, error);
      throw error;
    }
  }

  // Get user rating
  async getUserRating(articleId, userId) {
    try {
      const cacheKey = `${userId}_${articleId}`;
      if (this.ratingsCache.has(cacheKey)) {
        return this.ratingsCache.get(cacheKey);
      }

      const rating = await localDB.getUserData(`rating_${cacheKey}`);
      if (rating) {
        this.ratingsCache.set(cacheKey, rating);
      }

      return rating;
    } catch (error) {
      console.error(`Failed to get rating for article ${articleId}:`, error);
      return null;
    }
  }

  // Get article average rating
  async getArticleAverageRating(articleId) {
    try {
      const cacheKey = `avg_rating_${articleId}`;
      if (this.ratingsCache.has(cacheKey)) {
        return this.ratingsCache.get(cacheKey);
      }

      // Simulate calculation
      const averageRating = await this.calculateAverageRating(articleId);
      
      // Cache for 10 minutes
      this.ratingsCache.set(cacheKey, averageRating);
      setTimeout(() => {
        this.ratingsCache.delete(cacheKey);
      }, 600000);

      return averageRating;
    } catch (error) {
      console.error(`Failed to get average rating for article ${articleId}:`, error);
      return { average: 0, count: 0 };
    }
  }

  // Simulate calculation logic
  async calculateAverageRating(articleId) {
    const mockRatings = [
      { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 3 }, 
      { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }
    ];
    
    const ratingsForArticle = mockRatings.filter(r => r.articleId === articleId);
    const total = ratingsForArticle.reduce((sum, r) => sum + r.rating, 0);
    const average = ratingsForArticle.length > 0 ? total / ratingsForArticle.length : 0;
    
    return {
      average: Math.round(average * 10) / 10,
      count: ratingsForArticle.length
    };
  }

  // Update average rating
  async updateArticleAverageRating(articleId) {
    const averageRating = await this.getArticleAverageRating(articleId);
    console.log(`Updated average rating for article ${articleId}:`, averageRating);
  }

  // Interactions (Like, Share, etc)
  async interactWithArticle(articleId, interactionType, userId) {
    try {
      const interactionData = {
        id: `${userId}_${articleId}_${interactionType}`,
        userId,
        articleId,
        type: interactionType, // 'like', 'dislike', 'bookmark', 'share'
        createdAt: new Date().toISOString()
      };

      await localDB.saveUserData(`interaction_${interactionData.id}`, interactionData);
      
      // Update article stats
      await this.updateArticleInteractions(articleId, interactionType);
      
      return interactionData;
    } catch (error) {
      console.error(`Failed to record interaction ${interactionType} for article ${articleId}:`, error);
      throw error;
    }
  }

  // Update interaction stats
  async updateArticleInteractions(articleId, interactionType) {
    try {
      const statsKey = `article_stats_${articleId}`;
      let stats = await localDB.getUserData(statsKey) || {
        likes: 0,
        dislikes: 0,
        bookmarks: 0,
        shares: 0
      };

      switch (interactionType) {
        case 'like':
          stats.likes += 1;
          break;
        case 'dislike':
          stats.dislikes += 1;
          break;
        case 'bookmark':
          stats.bookmarks += 1;
          break;
        case 'share':
          stats.shares += 1;
          break;
      }

      await localDB.saveUserData(statsKey, stats);
      
      return stats;
    } catch (error) {
      console.error(`Failed to update interactions for article ${articleId}:`, error);
      return null;
    }
  }

  // Get interaction stats
  async getArticleInteractions(articleId) {
    try {
      const stats = await localDB.getUserData(`article_stats_${articleId}`);
      return stats || { likes: 0, dislikes: 0, bookmarks: 0, shares: 0 };
    } catch (error) {
      console.error(`Failed to get interactions for article ${articleId}:`, error);
      return { likes: 0, dislikes: 0, bookmarks: 0, shares: 0 };
    }
  }

  // Check if user interacted
  async hasUserInteracted(articleId, interactionType, userId) {
    try {
      const interaction = await localDB.getUserData(`interaction_${userId}_${articleId}_${interactionType}`);
      return !!interaction;
    } catch (error) {
      console.error(`Failed to check interaction for article ${articleId}:`, error);
      return false;
    }
  }

  // Get user ratings for multiple articles
  async getUserRatings(userId, articleIds) {
    try {
      const ratings = {};
      for (const articleId of articleIds) {
        const rating = await this.getUserRating(articleId, userId);
        if (rating) {
          ratings[articleId] = rating.rating;
        }
      }
      return ratings;
    } catch (error) {
      console.error('Failed to get user ratings:', error);
      return {};
    }
  }
}

export default new RatingService();