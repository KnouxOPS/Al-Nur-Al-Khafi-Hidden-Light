import { defineStore } from 'pinia';

const hadithCollection = [
  {
    text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
    source: "رواه البخاري",
    textEn: "Actions are judged by intentions, so each man will have what he intended.",
    sourceEn: "Sahih Al-Bukhari"
  },
  {
    text: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه",
    source: "رواه البخاري ومسلم",
    textEn: "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.",
    sourceEn: "Bukhari & Muslim"
  },
  {
    text: "الكلمة الطيبة صدقة",
    source: "متفق عليه",
    textEn: "A good word is charity.",
    sourceEn: "Muttafaq Alaih"
  },
  {
    text: "خياركم أحاسنكم أخلاقاً",
    source: "رواه البخاري",
    textEn: "The best among you are those who have the best manners and character.",
    sourceEn: "Sahih Al-Bukhari"
  },
  {
    text: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت",
    source: "رواه البخاري ومسلم",
    textEn: "Whoever believes in Allah and the Last Day should talk what is good or keep quiet.",
    sourceEn: "Bukhari & Muslim"
  }
];

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
      // Logic to pick a hadith based on the day of the year
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      const index = dayOfYear % hadithCollection.length;
      this.content.dailyHadith = hadithCollection[index];
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