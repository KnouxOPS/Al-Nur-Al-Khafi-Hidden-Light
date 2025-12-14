import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router/index.js';

// Import styles
import './assets/styles/main.scss';

// Import locales
import ar from './locales/ar.js';
import en from './locales/en.js';

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: localStorage.getItem('language') || 'ar',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    ar,
    en
  },
});

// Create app
const app = createApp(App);

// Use plugins
app.use(createPinia());
app.use(router);
app.use(i18n);

// Global error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info);
};

app.mount('#app');