import localDB from '@/database';

class CommentService {
  constructor() {
    this.commentsCache = new Map();
  }

  // Add new comment
  async addComment(commentData) {
    try {
      const comment = {
        id: this.generateId(),
        ...commentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        replies: commentData.replies || [],
        likes: 0,
        dislikes: 0,
        isApproved: true // In production this might be false by default
      };

      // Save to database
      await localDB.saveUserData(`comment_${comment.id}`, comment);
      
      // Update cache
      this.commentsCache.set(comment.id, comment);
      
      return comment;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }

  // Get comments for specific article
  async getCommentsForArticle(articleId, options = {}) {
    try {
      const cacheKey = `comments_${articleId}_${options.page || 1}`;
      
      // Check cache
      if (this.commentsCache.has(cacheKey)) {
        return this.commentsCache.get(cacheKey);
      }

      // Simulate fetching from DB
      const comments = await this.fetchCommentsFromDB(articleId, options);
      
      // Cache for 5 minutes
      this.commentsCache.set(cacheKey, comments);
      setTimeout(() => {
        this.commentsCache.delete(cacheKey);
      }, 300000);

      return comments;
    } catch (error) {
      console.error(`Failed to fetch comments for article ${articleId}:`, error);
      return { comments: [], pagination: { page: 1, totalPages: 0, total: 0 } };
    }
  }

  // Simulate DB fetch
  async fetchCommentsFromDB(articleId, options) {
    // In production this would be a real API call
    const mockComments = [
      {
        id: '1',
        articleId: articleId,
        author: 'أحمد محمد',
        avatar: '/images/avatar1.jpg',
        content: 'مقال ممتاز ومفيد جداً، جزى الله خيراً',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likes: 15,
        dislikes: 2,
        replies: [
          {
            id: '1-1',
            author: 'سارة علي',
            avatar: '/images/avatar2.jpg',
            content: 'أتفق معك أخي أحمد',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            likes: 8,
            dislikes: 0
          }
        ]
      },
      {
        id: '2',
        articleId: articleId,
        author: 'فاطمة عبدالله',
        avatar: '/images/avatar3.jpg',
        content: 'شكراً لك على هذه المعلومات القيمة',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: 23,
        dislikes: 1,
        replies: []
      }
    ];

    // Filter and sort
    let filteredComments = mockComments.filter(c => c.articleId === articleId);
    
    // Sort
    if (options.sortBy === 'popularity') {
      filteredComments.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
    } else {
      filteredComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);

    return {
      comments: paginatedComments,
      pagination: {
        page: page,
        totalPages: Math.ceil(filteredComments.length / limit),
        total: filteredComments.length
      }
    };
  }

  // Add reply
  async addReply(parentCommentId, replyData) {
    try {
      const parentComment = await this.getCommentById(parentCommentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }

      const reply = {
        id: this.generateId(),
        ...replyData,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };

      parentComment.replies.push(reply);
      parentComment.updatedAt = new Date().toISOString();

      // Update parent comment
      await localDB.saveUserData(`comment_${parentCommentId}`, parentComment);
      this.commentsCache.set(parentCommentId, parentComment);

      return reply;
    } catch (error) {
      console.error(`Failed to add reply to comment ${parentCommentId}:`, error);
      throw error;
    }
  }

  // Get comment by ID
  async getCommentById(commentId) {
    try {
      if (this.commentsCache.has(commentId)) {
        return this.commentsCache.get(commentId);
      }

      const comment = await localDB.getUserData(`comment_${commentId}`);
      if (comment) {
        this.commentsCache.set(commentId, comment);
      }

      return comment;
    } catch (error) {
      console.error(`Failed to fetch comment ${commentId}:`, error);
      return null;
    }
  }

  // Interactions
  async likeComment(commentId) {
    return this.updateCommentReaction(commentId, 'like');
  }

  async dislikeComment(commentId) {
    return this.updateCommentReaction(commentId, 'dislike');
  }

  async updateCommentReaction(commentId, reactionType) {
    try {
      const comment = await this.getCommentById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      if (reactionType === 'like') {
        comment.likes += 1;
      } else if (reactionType === 'dislike') {
        comment.dislikes += 1;
      }

      comment.updatedAt = new Date().toISOString();
      
      await localDB.saveUserData(`comment_${commentId}`, comment);
      this.commentsCache.set(commentId, comment);

      return comment;
    } catch (error) {
      console.error(`Failed to ${reactionType} comment ${commentId}:`, error);
      throw error;
    }
  }

  // Report comment
  async reportComment(commentId, reason) {
    try {
      const comment = await this.getCommentById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      if (!comment.reports) {
        comment.reports = [];
      }
      
      comment.reports.push({
        reason,
        reportedAt: new Date().toISOString(),
        reporterId: this.getCurrentUserId()
      });

      comment.updatedAt = new Date().toISOString();
      
      await localDB.saveUserData(`comment_${commentId}`, comment);
      this.commentsCache.set(commentId, comment);

      return true;
    } catch (error) {
      console.error(`Failed to report comment ${commentId}:`, error);
      throw error;
    }
  }

  // Delete comment
  async deleteComment(commentId) {
    try {
      await localDB.saveUserData(`comment_${commentId}`, null);
      this.commentsCache.delete(commentId);
      
      return true;
    } catch (error) {
      console.error(`Failed to delete comment ${commentId}:`, error);
      throw error;
    }
  }

  // Utils
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getCurrentUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  clearOldCache() {
    const now = Date.now();
    for (const [key, value] of this.commentsCache.entries()) {
      if (value.cachedAt && (now - value.cachedAt > 300000)) { 
        this.commentsCache.delete(key);
      }
    }
  }
}

export default new CommentService();