class LocalDatabase {
  constructor() {
    this.dbName = 'HiddenLightDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported in this environment');
      return;
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Database error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('articles')) {
          const articleStore = db.createObjectStore('articles', { keyPath: 'id' });
          articleStore.createIndex('category', 'category', { unique: false });
          articleStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('search_index')) {
          const searchStore = db.createObjectStore('search_index', { keyPath: 'term' });
          searchStore.createIndex('documents', 'documents', { unique: false });
        }

        if (!db.objectStoreNames.contains('user_data')) {
          db.createObjectStore('user_data', { keyPath: 'key' });
        }
      };
    });
  }

  async saveArticle(article) {
    if (!this.db) await this.init();
    if (!this.db) return; // Safety guard

    const transaction = this.db.transaction(['articles'], 'readwrite');
    const store = transaction.objectStore('articles');
    
    article.updatedAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      const request = store.put(article);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllArticles(filters = {}) {
    if (!this.db) await this.init();
    if (!this.db) return []; // Safety guard

    const transaction = this.db.transaction(['articles'], 'readonly');
    const store = transaction.objectStore('articles');
    
    let request;
    if (filters.category) {
      const index = store.index('category');
      request = index.getAll(IDBKeyRange.only(filters.category));
    } else {
      request = store.getAll();
    }

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        let results = request.result || [];
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          results = results.filter(article => 
            (article.title && article.title.toLowerCase().includes(searchTerm)) ||
            (article.content && article.content.toLowerCase().includes(searchTerm))
          );
        }
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveUserData(key, value) {
    if (!this.db) await this.init();
    if (!this.db) return; // Safety guard

    const transaction = this.db.transaction(['user_data'], 'readwrite');
    const store = transaction.objectStore('user_data');

    const userData = { key, value, updatedAt: new Date().toISOString() };

    return new Promise((resolve, reject) => {
      const request = store.put(userData);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserData(key) {
    if (!this.db) await this.init();
    if (!this.db) return null; // Safety guard

    const transaction = this.db.transaction(['user_data'], 'readonly');
    const store = transaction.objectStore('user_data');

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }
}

export default new LocalDatabase();