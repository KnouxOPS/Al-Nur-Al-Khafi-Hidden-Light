<template>
  <header class="app-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <!-- Logo and Title -->
      <div class="header-logo">
        <div class="logo-wrapper" @click="goHome">
          <div class="logo-icon">ن</div>
          <h1 class="app-title">{{ t('app.name') }}</h1>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <nav class="nav-desktop hidden-mobile">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.name" class="nav-item">
            <router-link 
              :to="item.path" 
              class="nav-link"
              active-class="active"
            >
              {{ t(`nav.${item.name}`) }}
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Theme Toggle -->
        <button 
          class="action-button theme-toggle" 
          @click="toggleTheme"
          :title="currentTheme === 'dark' ? t('settings.light') : t('settings.dark')"
        >
          <span v-if="currentTheme === 'dark'">☀️</span>
          <span v-else>🌙</span>
        </button>

        <!-- Language Switcher -->
        <button 
          class="action-button language-switcher" 
          @click="toggleLanguage"
          :title="currentLanguage === 'ar' ? 'English' : 'العربية'"
        >
          <span class="lang-code">{{ currentLanguage === 'ar' ? 'EN' : 'عربي' }}</span>
        </button>

        <!-- Mobile Menu Button -->
        <button 
          class="action-button menu-button hidden-desktop" 
          @click="toggleMobileMenu"
        >
          <span>{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-nav hidden-desktop">
        <ul class="mobile-nav-list">
          <li v-for="item in navItems" :key="item.name" class="mobile-nav-item">
            <router-link 
              :to="item.path" 
              class="mobile-nav-link"
              active-class="active"
              @click="closeMobileMenu"
            >
              {{ t(`nav.${item.name}`) }}
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/about" class="mobile-nav-link" active-class="active" @click="closeMobileMenu">
              {{ t('nav.about') }}
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { useMainStore } from '@/store';

const { t, locale } = useI18n();
const router = useRouter();
const store = useMainStore();
const { currentTheme, toggleTheme } = useTheme();

// State
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const currentLanguage = computed(() => store.preferences.language);

// Navigation items
const navItems = [
  { name: 'home', path: '/' },
  { name: 'biography', path: '/biography' },
  { name: 'hadith', path: '/hadith' },
  { name: 'companions', path: '/companions' },
  { name: 'battles', path: '/battles' },
  { name: 'wisdom', path: '/wisdom' }
];

// Handle scroll effect
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Go to home
const goHome = () => {
  router.push('/');
  closeMobileMenu();
};

// Toggle language
const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'ar' ? 'en' : 'ar';
  store.updatePreference('language', newLang);
  locale.value = newLang;
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
};

// Mount events
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// Unmount events
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $header-height;
  background-color: rgba($dark-primary, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba($dark-text, 0.05);
  z-index: $z-sticky;
  transition: all $duration-normal ease;
  
  &.scrolled {
    background-color: rgba($dark-primary, 0.95);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  
  .theme-light & {
    background-color: rgba($light-primary, 0.85);
    &.scrolled {
      background-color: rgba($light-primary, 0.95);
    }
  }
}

.header-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 $spacing-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: $dark-accent;
  color: $dark-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: 'Amiri', serif;
}

.app-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: $dark-text;
  margin: 0;
  
  .theme-light & {
    color: $light-text;
  }
}

.nav-list {
  display: flex;
  gap: $spacing-md;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: $dark-text-secondary;
  text-decoration: none;
  font-weight: 500;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  transition: color $duration-fast;
  
  .theme-light & {
    color: $light-text-secondary;
  }
  
  &:hover, &.active {
    color: $dark-accent;
    background: rgba($dark-accent, 0.05);
  }
}

.header-actions {
  display: flex;
  gap: $spacing-sm;
}

.action-button {
  background: transparent;
  border: 1px solid rgba($dark-text, 0.2);
  color: $dark-text;
  width: 36px;
  height: 36px;
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $duration-fast;
  
  .theme-light & {
    border-color: rgba($light-text, 0.2);
    color: $light-text;
  }
  
  &:hover {
    background: rgba($dark-accent, 0.1);
    color: $dark-accent;
    border-color: $dark-accent;
  }
}

.hidden-desktop {
  display: none;
}

@media (max-width: $breakpoint-tablet) {
  .hidden-mobile {
    display: none;
  }
  .hidden-desktop {
    display: block;
  }
}

.mobile-nav {
  position: absolute;
  top: $header-height;
  left: 0;
  width: 100%;
  background: $dark-primary;
  border-bottom: 1px solid rgba($dark-text, 0.1);
  padding: $spacing-md;
  
  .theme-light & {
    background: $light-primary;
  }
}

.mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-link {
  display: block;
  padding: $spacing-md 0;
  color: $dark-text;
  text-decoration: none;
  border-bottom: 1px solid rgba($dark-text, 0.05);
  
  .theme-light & {
    color: $light-text;
  }
  
  &.active {
    color: $dark-accent;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>