<template>
  <div class="biography-view container">
    <header class="section-header fade-in-up">
      <div class="icon-wrapper">
        <span class="header-icon">📖</span>
      </div>
      <h1 class="page-title">{{ t('biography.title') }}</h1>
      <p class="page-subtitle">{{ t('biography.subtitle') }}</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="timeline-container fade-in-up delay-1">
      <Timeline 
        :items="localizedEvents"
        :title="t('biography.chronology') || 'Chronology'"
        variant="vertical"
        :show-navigation="false"
        @itemSelect="handleEventSelect"
      />
    </div>

    <!-- Detail Modal (Optional enhancement) -->
    <Teleport to="body">
      <div v-if="selectedEvent" class="event-modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeModal">✕</button>
          <h2>{{ currentLang === 'ar' ? selectedEvent.titleAr : selectedEvent.title }}</h2>
          <span class="event-date">{{ selectedEvent.year }}</span>
          <p>{{ currentLang === 'ar' ? selectedEvent.descriptionAr : selectedEvent.description }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Timeline from '@/components/widgets/Timeline.vue';
import contentService from '@/services/content';

const { t, locale } = useI18n();
const events = ref([]);
const loading = ref(true);
const selectedEvent = ref(null);

const currentLang = computed(() => locale.value);

const localizedEvents = computed(() => {
  return events.value.map(event => ({
    ...event,
    title: currentLang.value === 'ar' ? event.titleAr : event.title,
    description: currentLang.value === 'ar' ? event.descriptionAr : event.description
  }));
});

const handleEventSelect = (event) => {
  // Map back to original event with all data
  const originalEvent = events.value.find(e => e.id === event.id);
  selectedEvent.value = originalEvent;
};

const closeModal = () => {
  selectedEvent.value = null;
};

onMounted(async () => {
  try {
    events.value = await contentService.getBiography();
  } catch (error) {
    console.error('Failed to load biography:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.biography-view {
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
  max-width: 600px;
  
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

.event-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: $dark-primary;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  max-width: 500px;
  width: 90%;
  position: relative;
  border: 1px solid $dark-accent;
  
  .theme-light & {
    background: $light-primary;
    border-color: $light-accent;
  }
  
  h2 {
    color: $dark-accent;
    font-family: 'Amiri', serif;
    margin-top: 0;
  }
  
  .event-date {
    display: inline-block;
    background: rgba($dark-accent, 0.1);
    color: $dark-accent;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-bottom: $spacing-md;
  }
  
  p {
    line-height: 1.6;
    color: $dark-text;
    
    .theme-light & {
      color: $light-text;
    }
  }
}

.close-btn {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  background: none;
  border: none;
  color: $dark-text-secondary;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: $dark-accent;
  }
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