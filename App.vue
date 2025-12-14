<template>
  <div id="app" :class="appClasses">
    <ParticleSystem v-if="showParticles" />
    <div class="app-wrapper">
      <AppHeader />
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <AppFooter />
    </div>
    <AudioPlayer />
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useMainStore } from './store/index.js';
import { useTheme } from './composables/useTheme.js';
import { useParticles } from './composables/useParticles.js';

// Components
import ParticleSystem from './components/common/ParticleSystem.vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import AudioPlayer from './components/widgets/AudioPlayer.vue';
import LoadingOverlay from './components/common/LoadingOverlay.vue';

const store = useMainStore();
const { currentTheme } = useTheme();
const { showParticles } = useParticles();

const appClasses = computed(() => ({
  'app-container': true,
  [`theme-${currentTheme.value}`]: true,
  'rtl': localStorage.getItem('language') === 'ar'
}));

const loading = computed(() => store.loading);

onMounted(() => {
  store.initializeApp();
  document.documentElement.dir = localStorage.getItem('language') === 'ar' ? 'rtl' : 'ltr';
});
</script>

<style lang="scss">
@import './assets/styles/variables';

#app {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: $spacing-lg;
  margin-top: $header-height;
  margin-bottom: $footer-height;
}

.theme-dark {
  background-color: $dark-background;
  color: $dark-text;
}

.theme-light {
  background-color: $light-background;
  color: $light-text;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: $breakpoint-mobile) {
  .app-main {
    padding: $spacing-md;
  }
}
</style>