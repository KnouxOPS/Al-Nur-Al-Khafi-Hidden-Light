<template>
  <div class="battles-view container">
    <header class="section-header fade-in-up">
      <div class="icon-wrapper">
        <span class="header-icon">⚔️</span>
      </div>
      <h1 class="page-title">{{ t('battles.title') }}</h1>
      <p class="page-subtitle">{{ t('battles.subtitle') }}</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="timeline-container fade-in-up delay-1">
      <Timeline 
        :items="localizedBattles"
        variant="vertical"
        :show-navigation="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Timeline from '@/components/widgets/Timeline.vue';
import contentService from '@/services/content';

const { t, locale } = useI18n();
const battles = ref([]);
const loading = ref(true);

const currentLang = computed(() => locale.value);

const localizedBattles = computed(() => {
  return battles.value.map(battle => ({
    ...battle,
    title: currentLang.value === 'ar' ? battle.nameAr : battle.name,
    description: currentLang.value === 'ar' ? battle.descriptionAr : battle.description,
    category: battle.result,
    year: battle.date
  }));
});

onMounted(async () => {
  try {
    battles.value = await contentService.getBattles();
  } catch (error) {
    console.error('Failed to load battles:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.battles-view {
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