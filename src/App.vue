<template>
  <div id="app" :class="appClasses">
    <Navbar />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <SearchModal 
      :is-open="isSearchOpen" 
      @close="closeSearch" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import SearchModal from '@/components/navigation/SearchModal.vue';

const store = useStore();
const { locale } = useI18n();

const isSearchOpen = ref(false);

const appClasses = computed(() => ({
  'theme-dark': store.getters.isDarkMode,
  'theme-light': !store.getters.isDarkMode,
  [`lang-${locale.value}`]: true
}));

function openSearch() {
  isSearchOpen.value = true;
}

function closeSearch() {
  isSearchOpen.value = false;
}

function handleKeyDown(event) {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault();
    openSearch();
  }
}

// Listen for custom search event from Navbar
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('open-search', openSearch);
  store.dispatch('loadDailyHadith');
  
  // Set initial direction
  document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr';
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('open-search', openSearch);
});
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>