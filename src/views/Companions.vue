<template>
  <div class="companions-view container">
    <header class="section-header fade-in-up">
      <div class="icon-wrapper">
        <span class="header-icon">👥</span>
      </div>
      <h1 class="page-title">{{ t('companions.title') }}</h1>
      <p class="page-subtitle">{{ t('companions.subtitle') }}</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="companions-grid fade-in-up delay-1">
      <div v-for="companion in companions" :key="companion.id" class="companion-item">
        <ContentCard
          :title="currentLang === 'ar' ? companion.nameAr : companion.name"
          :description="currentLang === 'ar' ? companion.descriptionAr : companion.description"
          :category="currentLang === 'ar' ? companion.titleAr : companion.title"
          :image="companion.image"
          variant="featured"
          :show-share="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ContentCard from '@/components/widgets/ContentCard.vue';
import contentService from '@/services/content';

const { t, locale } = useI18n();
const companions = ref([]);
const loading = ref(true);

const currentLang = computed(() => locale.value);

onMounted(async () => {
  try {
    companions.value = await contentService.getCompanions();
  } catch (error) {
    console.error('Failed to load companions:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.companions-view {
  padding-bottom: $spacing-xxl;
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-xxl;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba($dark-accent, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-md;
  font-size: 2rem;
  
  .theme-light & {
    background: rgba($light-accent, 0.1);
  }
}

.page-title {
  font-family: 'Amiri', serif;
  font-size: 2.5rem;
  color: $dark-accent;
  margin: 0 0 $spacing-sm;
  
  .theme-light & {
    color: $light-text;
  }
}

.page-subtitle {
  color: $dark-text-secondary;
  font-size: 1.1rem;
  
  .theme-light & {
    color: $light-text-secondary;
  }
}

.companions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-xl;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: $spacing-xl;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba($dark-accent, 0.3);
  border-top-color: $dark-accent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-1 { animation-delay: 0.2s; }

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>