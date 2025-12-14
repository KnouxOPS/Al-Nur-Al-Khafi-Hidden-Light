<template>
  <!-- الحاوية الرئيسية مع فئة الثيم الديناميكي -->
  <div id="app" :class="appClasses">
    
    <!-- خلفية الجسيمات المتحركة (طبقة سفلية) -->
    <ParticleSystem />

    <!-- التخطيط الرئيسي -->
    <div class="layout-wrapper">
      <!-- الشريط العلوي -->
      <AppHeader @open-search="openSearch" />

      <!-- محتوى الصفحات المتغير -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- تذييل الصفحة -->
      <AppFooter />
    </div>

    <!-- العناصر العامة (فوق كل شيء) -->
    <AudioPlayer />
    
    <!-- نافذة البحث -->
    <SearchModal 
      :is-open="store.isSearchOpen" 
      @close="closeSearch" 
    />

    <!-- شاشة التحميل -->
    <LoadingOverlay v-if="store.isLoading" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useMainStore } from '@/store';
import { useI18n } from 'vue-i18n';

// استيراد المكونات
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import ParticleSystem from '@/components/common/ParticleSystem.vue';
import AudioPlayer from '@/components/widgets/AudioPlayer.vue';
import SearchModal from '@/components/navigation/SearchModal.vue';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';

// استيراد الخدمات
import authService from '@/services/authService';
import notificationService from '@/services/notificationService';

// التهيئة
const store = useMainStore();
const { locale } = useI18n();

// حساب فئات التطبيق (للثيم واللغة)
const appClasses = computed(() => ({
  'theme-dark': store.theme === 'dark',
  'theme-light': store.theme === 'light',
  [`lang-${locale.value}`]: true,
  'rtl': locale.value === 'ar',
  'ltr': locale.value === 'en'
}));

// دوال التحكم في البحث
function openSearch() {
  store.isSearchOpen = true;
}

function closeSearch() {
  store.isSearchOpen = false;
}

// عند بدء التطبيق
onMounted(async () => {
  // 1. تهيئة الإعدادات العامة
  await store.initApp();

  // 2. التحقق من المصادقة
  await authService.initialize();

  // 3. تهيئة الإشعارات
  notificationService.initialize();

  // 4. استماع لاختصارات لوحة المفاتيح (Ctrl+K للبحث)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      store.isSearchOpen = !store.isSearchOpen;
    }
  });
});
</script>

<style lang="scss">
/* استيراد المتغيرات والأنماط العامة */
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/main.scss';

#app {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* تنسيقات الثيمات المباشرة لضمان عملها فوراً */
.theme-dark {
  background-color: #0D1F22; /* لون الخلفية الداكن */
  color: #FAF9F6;
}

.theme-light {
  background-color: #F5F0E6; /* لون الخلفية الفاتح */
  color: #3B3630;
}

.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  z-index: 10; /* فوق الخلفية المتحركة */
  position: relative;
}

.main-content {
  flex: 1; /* تأخذ المساحة المتبقية */
  padding-top: 80px; /* مسافة للنافبار */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

/* حركة الانتقال بين الصفحات */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>