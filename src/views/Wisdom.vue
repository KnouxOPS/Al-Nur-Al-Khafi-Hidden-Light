<template>
  <div class="wisdom-view container">
    <header class="section-header fade-in-up">
      <div class="icon-wrapper">
        <span class="header-icon">📜</span>
      </div>
      <h1 class="page-title">{{ t('wisdom.title') }}</h1>
      <p class="page-subtitle">{{ t('wisdom.subtitle') }}</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="wisdom-grid fade-in-up delay-1">
      <div v-for="quote in wisdom" :key="quote.id" class="quote-card">
        <div class="quote-icon">❝</div>
        <p class="quote-text">{{ currentLang === 'ar' ? quote.textAr : quote.text }}</p>
        <div class="quote-footer">
          <span class="quote-source">{{ currentLang === 'ar' ? quote.sourceAr : quote.source }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import contentService from '@/services/content';

const { t, locale } = useI18n();
const wisdom = ref([]);
const loading = ref(true);

const currentLang = computed(() => locale.value);

onMounted(async () => {
  try {
    wisdom.value = await contentService.getWisdom();
  } catch (error) {
    console.error('Failed to load wisdom:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.wisdom-view {
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

.wisdom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-xl;
}

.quote-card {
  background: rgba($dark-secondary, 0.3);
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  border: 1px solid rgba($dark-accent, 0.1);
  position: relative;
  transition: transform 0.3s ease;
  
  .theme-light & {
    background: rgba($light-secondary, 0.3);
    border-color: rgba($light-accent, 0.1);
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba($dark-accent, 0.3);
    .theme-light & { border-color: rgba($light-accent, 0.3); }
  }
}

.quote-icon {
  font-size: 3rem;
  color: $dark-accent;
  opacity: 0.2;
  position: absolute;
  top: $spacing-md;
  left: $spacing-md;
  line-height: 1;
  font-family: serif;
  
  [dir="rtl"] & {
    left: auto;
    right: $spacing-md;
  }
}

.quote-text {
  font-family: 'Amiri', serif;
  font-size: 1.4rem;
  line-height: 1.8;
  color: $dark-text;
  margin-bottom: $spacing-lg;
  position: relative;
  z-index: 1;
  text-align: center;
  
  .theme-light & {
    color: $light-text;
  }
}

.quote-footer {
  text-align: center;
  border-top: 1px solid rgba($dark-border, 0.5);
  padding-top: $spacing-md;
  
  .theme-light & {
    border-color: rgba($light-border, 0.5);
  }
}

.quote-source {
  font-size: 0.9rem;
  color: $dark-text-secondary;
  font-weight: 500;
  
  .theme-light & {
    color: $light-text-secondary;
  }
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