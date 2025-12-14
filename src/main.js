import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';

// Import styles
import './assets/styles/main.scss';
import './assets/styles/global.scss';

// Import locales
import ar from './locales/ar.js';
import en from './locales/en.js';

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'ar',
  fallbackLocale: 'en',
  messages: {
    ar,
    en
  },
});

// Create app
const app = createApp(App);

// Use plugins
app.use(store);
app.use(router);
app.use(i18n);

// Global error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info);
};

app.mount('#app');