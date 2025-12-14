<template>
  <div class="hadith-view container">
    <header class="section-header fade-in-up">
      <h1 class="page-title">{{ t('hadith.title') }}</h1>
      <p class="page-subtitle">{{ t('hadith.subtitle') }}</p>
    </header>

    <!-- Filters -->
    <div class="filters-bar fade-in-up delay-1">
      <div class="search-wrapper">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="t('hadith.search')" 
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="category-filters">
        <button 
          v-for="cat in categories" 
          :key="cat"
          class="filter-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = selectedCategory === cat ? null : cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Content Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>
    
    <div v-else-if="filteredHadiths.length === 0" class="empty-state">
      <p>{{ t('common.error') ? t('messages.noResults') : 'No hadiths found' }}</p>
    </div>

    <div v-else class="hadith-grid fade-in-up delay-2">
      <div v-for="hadith in filteredHadiths" :key="hadith.id" class="hadith-item">
        <ContentCard
          :title="currentLang === 'ar' ? hadith.textAr : hadith.text"
          :description="currentLang === 'ar' ? hadith.sourceAr : hadith.source"
          :category="hadith.category"
          :tags="hadith.tags"
          :show-share="true"
          :show-bookmark="true"
          icon="hadith"
          variant="default"
          :truncate-title="false"
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
const hadiths = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref(null);

const currentLang = computed(() => locale.value);

const categories = computed(() => {
  const cats = new Set(hadiths.value.map(h => h.category));
  return Array.from(cats);
});

const filteredHadiths = computed(() => {
  return hadiths.value.filter(h => {
    const matchesCategory = !selectedCategory.value || h.category === selectedCategory.value;
    const searchLower = searchQuery.value.toLowerCase();
    const text = currentLang.value === 'ar' ? h.textAr : h.text;
    const matchesSearch = !searchQuery.value || text.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });
});

onMounted(async () => {
  try {
    hadiths.value = await contentService.getHadiths();
  } catch (error) {
    console.error('Failed to load hadiths:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.hadith-view {
  padding-bottom: $spacing-xxl;
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.page-title {
  font-family: 'Amiri', serif;
  font-size: 2.5rem;
  color: $dark-accent;
  margin-bottom: $spacing-xs;
  
  .theme-light & {
    color: $light-text;
  }
}

.page-subtitle {
  color: $dark-text-secondary;
  
  .theme-light & {
    color: $light-text-secondary;
  }
}

.filters-bar {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  
  @media (min-width: $breakpoint-tablet) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
  
  .search-input {
    width: 100%;
    padding: $spacing-sm $spacing-xl;
    background: rgba($dark-secondary, 0.3);
    border: 1px solid rgba($dark-border, 0.5);
    border-radius: $border-radius-pill;
    color: $dark-text;
    
    .theme-light & {
      background: rgba($light-secondary, 0.3);
      color: $light-text;
      border-color: rgba($light-border, 0.5);
    }
    
    &:focus {
      outline: none;
      border-color: $dark-accent;
    }
  }
  
  .search-icon {
    position: absolute;
    left: $spacing-sm; // LTR default
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
    
    [dir="rtl"] & {
      left: auto;
      right: $spacing-sm;
    }
  }
}

.category-filters {
  display: flex;
  gap: $spacing-sm;
  overflow-x: auto;
  padding-bottom: $spacing-xs;
  
  .filter-btn {
    background: rgba($dark-secondary, 0.3);
    border: 1px solid transparent;
    color: $dark-text-secondary;
    padding: 6px 16px;
    border-radius: $border-radius-pill;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    
    .theme-light & {
      background: rgba($light-secondary, 0.3);
      color: $light-text-secondary;
    }
    
    &:hover, &.active {
      background: rgba($dark-accent, 0.15);
      color: $dark-accent;
      border-color: rgba($dark-accent, 0.3);
    }
  }
}

.hadith-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.loading-state, .empty-state {
  text-align: center;
  padding: $spacing-xxl;
  color: $dark-text-secondary;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba($dark-accent, 0.3);
  border-top-color: $dark-accent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
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
.delay-2 { animation-delay: 0.4s; }

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>