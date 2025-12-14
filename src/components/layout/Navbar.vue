<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-name">{{ t('home.project_name_part1') }}</span>
          <span class="brand-highlight">{{ t('home.project_name_part2') }}</span>
        </router-link>
      </div>
      
      <div class="nav-menu" :class="{ active: isMenuOpen }">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          class="nav-link"
          @click="closeMenu"
        >
          {{ item.name }}
        </router-link>
      </div>
      
      <div class="nav-actions">
        <button @click="toggleSearch" class="search-toggle" :aria-label="t('search.placeholder')">
          <svg class="icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button @click="toggleTheme" class="theme-toggle" :aria-label="t('common.toggle_theme')">
          <svg v-if="isDarkMode" class="icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.6569 17.6569M6.34315 6.34315L5.63604 5.63604M18.364 5.63609L17.6569 6.3432M6.3432 17.6569L5.63609 18.364" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button @click="toggleLanguage" class="language-toggle">
          {{ currentLang === 'ar' ? 'EN' : 'AR' }}
        </button>
        
        <button @click="toggleMenu" class="menu-toggle" :aria-label="t('common.menu')">
          <svg v-if="!isMenuOpen" class="icon" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const store = useStore();
const { t, locale } = useI18n();
const router = useRouter();

const isMenuOpen = ref(false);
const isDarkMode = computed(() => store.getters.isDarkMode);
const currentLang = computed(() => store.getters.currentLanguage);

const navItems = computed(() => [
  { name: t('nav.biography'), path: '/biography' },
  { name: t('nav.timeline'), path: '/timeline' },
  { name: t('nav.about'), path: '/about' },
  { name: t('nav.contribute'), path: '/contribute' },
  { name: t('nav.aiSearch'), path: '/ai-search' }
]);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function toggleSearch() {
  window.dispatchEvent(new CustomEvent('open-search'));
}

function toggleTheme() {
  store.commit('TOGGLE_THEME');
}

function toggleLanguage() {
  const newLang = currentLang.value === 'ar' ? 'en' : 'ar';
  store.dispatch('setLanguage', newLang);
  locale.value = newLang;
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.navbar {
  background-color: $dark-primary;
  border-bottom: 1px solid $dark-border;
  position: sticky;
  top: 0;
  z-index: $z-modal - 1;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav-brand {
  .brand-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    
    .brand-name {
      font-size: $font-size-lg;
      font-weight: 700;
      color: $dark-text;
    }
    
    .brand-highlight {
      font-size: $font-size-lg;
      font-weight: 700;
      color: $dark-accent;
      margin-left: $spacing-xs;
    }
  }
}

.nav-menu {
  display: flex;
  gap: $spacing-lg;
  
  .nav-link {
    color: $dark-text-secondary;
    text-decoration: none;
    font-size: $font-size-md;
    transition: color $duration-fast $ease-in-out;
    
    &:hover,
    &.router-link-exact-active {
      color: $dark-accent;
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  
  .search-toggle,
  .theme-toggle,
  .language-toggle,
  .menu-toggle {
    background: transparent;
    border: none;
    color: $dark-text-secondary;
    cursor: pointer;
    padding: $spacing-sm;
    border-radius: $border-radius-sm;
    transition: all $duration-fast $ease-in-out;
    
    &:hover {
      color: $dark-accent;
      background-color: rgba($dark-accent, 0.1);
    }
    
    .icon {
      width: 20px;
      height: 20px;
    }
  }
  
  .language-toggle {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: $font-size-sm;
  }
}

.menu-toggle {
  display: none;
}

@media (max-width: $breakpoint-mobile) {
  .nav-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: $dark-primary;
    flex-direction: column;
    padding: $spacing-lg;
    gap: $spacing-md;
    border-bottom: 1px solid $dark-border;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all $duration-normal $ease-in-out;
    z-index: $z-fixed;
    
    &.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .nav-link {
      padding: $spacing-md;
      width: 100%;
      text-align: center;
    }
  }
  
  .menu-toggle {
    display: block;
  }
  
  .nav-actions {
    .search-toggle,
    .theme-toggle {
      display: none;
    }
  }
}

.lang-en .nav-menu {
  flex-direction: row;
}

.lang-ar .nav-brand .brand-link {
  flex-direction: row;
}
</style>