import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    loading: false,
    error: null,
    user: null,
    preferences: {
      theme: localStorage.getItem('theme') || 'dark',
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
    currentTheme: (state) => state.preferences.theme,
    currentLanguage: (state) => state.preferences.language,
    isLoading: (state) => state.loading
  },
  
  actions: {
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
      // Mock content for now
      this.content.dailyHadith = { text: "إنما الأعمال بالنيات", source: "Bukhari" };
    },
    
    async loadUserPreferences() {
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) };
      }
    },
    
    updatePreference(key, value) {
      this.preferences[key] = value;
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    },
    
    initializeServices() {
      if (this.preferences.notifications) {
        this.setupNotifications();
      }
    },
    
    setupNotifications() {
      console.log('Setting up notifications...');
    }
  }
});