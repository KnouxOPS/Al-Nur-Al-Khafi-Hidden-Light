import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    loading: false,
    theme: localStorage.getItem('theme') || 'dark', // Exposed directly for App.vue
    isSearchOpen: false, // Added for global search modal control
    error: null,
    user: null,
    preferences: {
      language: localStorage.getItem('language') || 'ar',
      audioEnabled: true,
      notifications: true
    },
    content: {
      dailyHadith: null,
      featuredContent: [],
      searchResults: []
    }
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentTheme: (state) => state.theme,
    currentLanguage: (state) => state.preferences.language,
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Alias for App.vue which calls initApp()
    async initApp() {
      return this.initializeApp();
    },

    async initializeApp() {
      this.setLoading(true);
      try {
        await this.loadDailyContent();
        await this.loadUserPreferences();
        this.initializeServices();
      } catch (error) {
        this.setError(error);
      } finally {
        this.setLoading(false);
      }
    },
    
    setLoading(status) {
      this.loading = status;
    },
    
    setError(error) {
      this.error = error;
      console.error('Store error:', error);
    },
    
    async loadDailyContent() {
      // Mock content
      this.content.dailyHadith = { text: "إنما الأعمال بالنيات", source: "Bukhari", id: 1 };
    },
    
    async loadUserPreferences() {
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) };
      }
    },
    
    updatePreference(key, value) {
      if (key === 'theme') {
        this.theme = value;
        localStorage.setItem('theme', value);
      } else {
        this.preferences[key] = value;
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
      }
    },
    
    initializeServices() {
      if (this.preferences.notifications) {
        console.log('Notifications service enabled');
      }
    }
  }
});