import localDB from '@/database';

class NotificationService {
  constructor() {
    this.notifications = [];
    this.subscribers = [];
    this.permission = 'default';
  }

  // Request permission
  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission;
    }
    return 'denied';
  }

  // Create notification
  async createNotification(notificationData) {
    try {
      const notification = {
        id: this.generateId(),
        ...notificationData,
        createdAt: new Date().toISOString(),
        read: false,
        priority: notificationData.priority || 'normal'
      };

      // Save DB
      await localDB.saveUserData(`notification_${notification.id}`, notification);
      
      // Add to local list
      this.notifications.unshift(notification);
      
      // Send
      this.sendNotification(notification);
      
      // Notify subscribers
      this.notifySubscribers('created', notification);
      
      return notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  // Send system notification
  async sendNotification(notification) {
    // Browser notification
    if (this.permission === 'granted' && 'Notification' in window) {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/favicon.ico',
        tag: notification.id
      });
    }

    // In-app notification
    this.showInAppNotification(notification);
  }

  // Show in-app notification
  showInAppNotification(notification) {
    console.log('New notification:', notification);
    // Simple alert for now (use Toast in production)
    if (notification.priority === 'high') {
      // alert(`${notification.title}\n${notification.message}`);
    }
  }

  // Get notifications
  async getNotifications(options = {}) {
    try {
      // Simulate fetching from DB
      const notifications = await this.fetchNotificationsFromDB(options);
      return notifications;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return { notifications: [], pagination: { page: 1, totalPages: 0, total: 0 } };
    }
  }

  // Simulate DB fetch
  async fetchNotificationsFromDB(options) {
    const mockNotifications = [
      {
        id: '1',
        title: 'مقال جديد',
        message: 'تم نشر مقال جديد عن السيرة النبوية',
        type: 'article',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        priority: 'normal'
      },
      {
        id: '2',
        title: 'تحديث مهم',
        message: 'تم تحديث نظام البحث بالذكاء الاصطناعي',
        type: 'system',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        priority: 'high'
      }
    ];

    let filtered = mockNotifications;
    
    if (options.read !== undefined) {
      filtered = filtered.filter(n => n.read === options.read);
    }
    
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = filtered.slice(startIndex, endIndex);
    
    return {
      notifications: paginated,
      pagination: {
        page: page,
        totalPages: Math.ceil(filtered.length / limit),
        total: filtered.length
      }
    };
  }

  // Mark as read
  async markAsRead(notificationId) {
    try {
      const notification = await localDB.getUserData(`notification_${notificationId}`);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        
        await localDB.saveUserData(`notification_${notificationId}`, notification);
        
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
          this.notifications[index] = notification;
        }
        
        this.notifySubscribers('updated', notification);
      }
      
      return notification;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  // Mark all as read
  async markAllAsRead() {
    try {
      const unreadNotifications = this.notifications.filter(n => !n.read);
      const updatedNotifications = [];
      
      for (const notification of unreadNotifications) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        
        await localDB.saveUserData(`notification_${notification.id}`, notification);
        updatedNotifications.push(notification);
      }
      
      this.notifications = this.notifications.map(n => 
        updatedNotifications.find(un => un.id === n.id) || n
      );
      
      this.notifySubscribers('batch_updated', updatedNotifications);
      
      return updatedNotifications.length;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await localDB.saveUserData(`notification_${notificationId}`, null);
      
      const index = this.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
      
      this.notifySubscribers('deleted', { id: notificationId });
      
      return true;
    } catch (error) {
      console.error(`Failed to delete notification ${notificationId}:`, error);
      throw error;
    }
  }

  // Subscriptions
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  notifySubscribers(event, data) {
    this.subscribers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in notification subscriber:', error);
      }
    });
  }

  // Count
  async getUnreadCount() {
    try {
      const notifications = await this.getNotifications({ read: false });
      return notifications.pagination.total;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  generateId() {
    return 'notif_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async initialize() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    
    const recentNotifications = await this.getNotifications({ limit: 5 });
    this.notifications = recentNotifications.notifications;
  }
}

export default new NotificationService();