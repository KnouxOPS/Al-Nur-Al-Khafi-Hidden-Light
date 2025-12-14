<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="search-modal" 
      @click="handleBackdropClick"
      role="dialog"
      aria-modal="true"
      :aria-label="t('common.search')"
    >
      <div class="search-container" @click.stop>
        <!-- Search Header -->
        <div class="search-header">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              :placeholder="t('common.search') || 'Search...'"
              class="search-input"
              @input="debouncedSearch"
              @keydown.enter="handleEnter"
              @keydown.esc="closeModal"
              autocomplete="off"
              :aria-label="t('search.placeholder') || 'Search content'"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-button" :aria-label="t('common.close') || 'Clear search'">
              <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <button @click="closeModal" class="close-button" :aria-label="t('common.close') || 'Close'">
            <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Recent Searches -->
        <div v-if="!searchQuery && recentSearches.length > 0" class="recent-searches">
          <h3 class="section-title">{{ t('nav.search') }} - {{ t('common.viewAll') || 'Recent' }}</h3>
          <div class="search-tags" role="list">
            <button
              v-for="(search, index) in recentSearches"
              :key="index"
              @click="selectRecentSearch(search)"
              class="search-tag"
              role="listitem"
            >
              {{ search }}
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div v-else-if="searchQuery" class="search-results" role="region" :aria-label="t('search.results_label') || 'Search Results'">
          <div v-if="isLoading" class="loading-results" aria-live="polite">
            <div class="spinner"></div>
            <p>{{ t('common.loading') }}</p>
          </div>
          
          <template v-else>
            <!-- AI Results -->
            <div v-if="aiSearchResults.length > 0" class="results-list ai-results">
              <div class="ai-header">
                <h3>{{ t('search.ai_results') }}</h3>
                <span class="confidence-badge" :aria-label="t('search.confidence') + ' ' + aiConfidence + '%'">{{ t('search.confidence') }}: {{ aiConfidence }}%</span>
              </div>
              
              <div
                v-for="result in aiSearchResults"
                :key="'ai-' + result.id"
                class="result-item ai-result"
                @click="openResult(result)"
                role="button"
                tabindex="0"
                @keydown.enter="openResult(result)"
                @keydown.space.prevent="openResult(result)"
              >
                <div class="result-icon" aria-hidden="true">
                  <span v-if="result.type === 'biography'">📖</span>
                  <span v-else-if="result.type === 'hadith'">📜</span>
                  <span v-else>✨</span>
                </div>
                <div class="result-content">
                  <h4 class="result-title">{{ result.title }}</h4>
                  <p class="result-preview" v-html="result.excerpt"></p>
                  <div class="result-meta">
                    <span class="result-type">{{ getResultTypeLabel(result.type) }}</span>
                    <span class="result-score">{{ t('search.relevance') }}: {{ result.score }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Standard Results -->
            <div v-if="searchResults.length > 0" class="results-list">
              <h3 v-if="aiSearchResults.length > 0" class="section-title mt-4">{{ t('search.popular') }}</h3>
              <div
                v-for="result in searchResults"
                :key="result.id"
                class="result-item"
                @click="openResult(result)"
                role="button"
                tabindex="0"
                @keydown.enter="openResult(result)"
                @keydown.space.prevent="openResult(result)"
              >
                <div class="result-icon" aria-hidden="true">
                  <span v-if="result.type === CONTENT_TYPES.BIOGRAPHY">📖</span>
                  <span v-else-if="result.type === CONTENT_TYPES.HADITH">📜</span>
                  <span v-else-if="result.type === CONTENT_TYPES.COMPANION">👥</span>
                  <span v-else>🔍</span>
                </div>
                <div class="result-content">
                  <h4 class="result-title">{{ result.title }}</h4>
                  <p class="result-preview">{{ truncateText(result.preview, 100) }}</p>
                  <span class="result-type">{{ getResultTypeLabel(result.type) }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="searchResults.length === 0 && aiSearchResults.length === 0" class="no-results" aria-live="polite">
              <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>{{ t('search.no_results') }}</p>
              <p class="no-results-hint">{{ t('search.try_again') }}</p>
            </div>
          </template>
        </div>
        
        <!-- Popular Searches -->
        <div v-else class="popular-searches">
          <h3 class="section-title">{{ t('nav.exploreSections') || 'Popular' }}</h3>
          <div class="search-tags" role="list">
            <button
              v-for="(tag, index) in popularTags"
              :key="index"
              @click="selectPopularTag(tag)"
              class="search-tag"
              role="listitem"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { truncateText, debounce } from '@/utils/helpers';
import { CONTENT_TYPES } from '@/utils/constants';
import aiSearchService from '@/services/aiSearchService';
import articleService from '@/services/articleService';
import localDB from '@/database';
import contentService from '@/services/content';

const { t } = useI18n();
const router = useRouter();

// Props
const props = defineProps({
  isOpen: Boolean
});

// Emits
const emit = defineEmits(['close']);

// Refs
const searchInput = ref(null);
const searchQuery = ref('');
const searchResults = ref([]);
const aiSearchResults = ref([]);
const aiConfidence = ref(0);
const isLoading = ref(false);
const recentSearches = ref(JSON.parse(localStorage.getItem('recentSearches')) || []);

// Popular search tags
const popularTags = ref([
  'مولد النبي',
  'الهجرة النبوية',
  'غزوة بدر',
  'الصحابة الكرام',
  'الأخلاق النبوية'
]);

// Initialize AI Search with mock data from content service
onMounted(async () => {
  // Feed content to AI Search Index
  try {
    const biography = await contentService.getBiography();
    const hadiths = await contentService.getHadiths();
    const companions = await contentService.getCompanions();
    
    const content = [
      ...biography.map(b => ({ ...b, type: 'biography', content: b.descriptionAr || b.description })),
      ...hadiths.map(h => ({ ...h, title: h.sourceAr || h.source, type: 'hadith', content: h.textAr || h.text })),
      ...companions.map(c => ({ ...c, title: c.nameAr || c.name, type: 'companion', content: c.descriptionAr || c.description }))
    ];
    
    await aiSearchService.initializeSearchIndex(content);
  } catch (err) {
    console.error("Error initializing AI search:", err);
  }
});

// Debounced search function
const debouncedSearch = debounce(() => {
  performSearch();
}, 500);

// Focus input when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus();
    });
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Get result type label
const getResultTypeLabel = (type) => {
  return t(`nav.${type}`) || type;
};

// Perform search
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    aiSearchResults.value = [];
    return;
  }

  isLoading.value = true;
  
  try {
    // 1. Traditional/Mock Search
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock standard results based on query match (simple filter)
    // In real app, call articleService.searchArticles(query)
    searchResults.value = [
      {
        id: 1,
        title: 'مولد النبي محمد ﷺ',
        preview: 'ولد النبي محمد ﷺ في مكة المكرمة في عام الفيل، يوم الاثنين الثاني عشر من ربيع الأول...',
        type: CONTENT_TYPES.BIOGRAPHY,
        path: '/biography'
      },
      {
        id: 2,
        title: 'حديث: إنما الأعمال بالنيات',
        preview: 'عن أمير المؤمنين أبي حفص عمر بن الخطاب رضي الله عنه قال: سمعت رسول الله ﷺ يقول...',
        type: CONTENT_TYPES.HADITH,
        path: '/hadith'
      }
    ].filter(item => item.title.includes(searchQuery.value) || item.preview.includes(searchQuery.value));

    // 2. AI Semantic Search
    const aiResponse = await aiSearchService.search(searchQuery.value, {
      limit: 3,
      includeExcerpts: true
    });

    aiSearchResults.value = aiResponse.results;
    aiConfidence.value = Math.round(aiResponse.results[0]?.score * 10 || 0) * 10; // Fake percentage scale
    
    // Save to local storage/DB
    addToRecentSearches(searchQuery.value);
    
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
    aiSearchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Add to recent searches
const addToRecentSearches = (query) => {
  if (!query.trim()) return;
  const index = recentSearches.value.indexOf(query);
  if (index !== -1) {
    recentSearches.value.splice(index, 1);
  }
  recentSearches.value.unshift(query);
  if (recentSearches.value.length > 5) {
    recentSearches.value.pop();
  }
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
  localDB.saveUserData('recentSearches', recentSearches.value).catch(console.error);
};

// Select recent search
const selectRecentSearch = (query) => {
  searchQuery.value = query;
  performSearch();
};

// Select popular tag
const selectPopularTag = (tag) => {
  searchQuery.value = tag;
  performSearch();
};

// Clear search
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  aiSearchResults.value = [];
  searchInput.value?.focus();
};

// Handle enter key
const handleEnter = () => {
  if (aiSearchResults.value.length > 0) {
    openResult(aiSearchResults.value[0]);
  } else if (searchResults.value.length > 0) {
    openResult(searchResults.value[0]);
  }
};

// Open result
const openResult = (result) => {
  closeModal();
  if (result.path) {
    router.push(result.path);
  } else {
    // Map type to route
    const route = `/${result.type}`;
    router.push(route);
  }
};

// Handle backdrop click
const handleBackdropClick = () => {
  closeModal();
};

// Close modal
const closeModal = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: $z-modal;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
}

.search-container {
  width: 90%;
  max-width: 800px;
  background-color: $dark-primary;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-header {
  display: flex;
  align-items: center;
  padding: $spacing-md;
  border-bottom: 1px solid $dark-border;
  gap: $spacing-md;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: $spacing-md;
  width: 20px;
  height: 20px;
  color: $dark-text-secondary;
  
  [dir="rtl"] & {
    left: auto;
    right: $spacing-md;
  }
}

.search-input {
  width: 100%;
  padding: $spacing-md $spacing-xl $spacing-md 48px;
  background-color: $dark-secondary;
  border: 1px solid $dark-border;
  border-radius: $border-radius-pill;
  color: $dark-text;
  font-size: $font-size-md;
  
  [dir="rtl"] & {
    padding: $spacing-md 48px $spacing-md $spacing-xl;
  }
  
  &:focus {
    border-color: $dark-accent;
    outline: none;
  }
}

.clear-button {
  position: absolute;
  right: $spacing-md;
  background: transparent;
  border: none;
  color: $dark-text-secondary;
  cursor: pointer;
  
  [dir="rtl"] & {
    right: auto;
    left: $spacing-md;
  }
  
  &:hover {
    color: $dark-accent;
  }
  
  .icon {
    width: 18px;
    height: 18px;
  }
}

.close-button {
  background: transparent;
  border: none;
  color: $dark-text-secondary;
  cursor: pointer;
  padding: $spacing-xs;
  
  &:hover {
    color: $dark-accent;
  }
  
  .icon {
    width: 24px;
    height: 24px;
  }
}

.recent-searches,
.popular-searches,
.search-results {
  padding: $spacing-md;
  max-height: 60vh;
  overflow-y: auto;
}

.section-title {
  font-size: $font-size-sm;
  color: $dark-text-secondary;
  margin-bottom: $spacing-md;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.search-tag {
  background-color: $dark-secondary;
  color: $dark-text;
  border: 1px solid $dark-border;
  border-radius: $border-radius-pill;
  padding: $spacing-xs $spacing-md;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all $duration-fast $ease-in-out;
  
  &:hover {
    background-color: rgba($dark-accent, 0.1);
    border-color: $dark-accent;
    color: $dark-accent;
  }
}

.loading-results, .no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl 0;
  text-align: center;
  
  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba($dark-accent, 0.3);
    border-radius: 50%;
    border-top-color: $dark-accent;
    animation: spin 1s linear infinite;
    margin-bottom: $spacing-md;
  }
  
  p {
    color: $dark-text-secondary;
  }
  
  .no-results-icon {
    width: 48px;
    height: 48px;
    color: $dark-text-secondary;
    margin-bottom: $spacing-md;
    opacity: 0.5;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.result-item {
  display: flex;
  align-items: flex-start;
  padding: $spacing-md;
  border-radius: $border-radius-md;
  background-color: $dark-secondary;
  cursor: pointer;
  transition: all $duration-fast $ease-in-out;
  border: 1px solid transparent;
  
  &:hover, &:focus-visible {
    background-color: lighten($dark-secondary, 5%);
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: rgba($dark-accent, 0.3);
    outline: none;
  }
}

.result-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($dark-accent, 0.1);
  border-radius: $border-radius-sm;
  margin-right: $spacing-md;
  font-size: 1.2rem;
  
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: $spacing-md;
  }
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $dark-text;
  margin: 0 0 $spacing-xs 0;
}

.result-preview {
  font-size: $font-size-sm;
  color: $dark-text-secondary;
  margin: 0 0 $spacing-xs 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-type {
  display: inline-block;
  font-size: $font-size-xs;
  background-color: rgba($dark-accent, 0.1);
  color: $dark-accent;
  padding: 2px $spacing-sm;
  border-radius: $border-radius-sm;
  text-transform: uppercase;
}

// AI Results Styles
.ai-results {
  margin-bottom: $spacing-lg;
  
  .ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $dark-border;
    
    h3 {
      font-size: $font-size-lg;
      color: $dark-text;
      font-weight: 700;
    }
    
    .confidence-badge {
      background-color: rgba($dark-accent, 0.2);
      color: $dark-accent;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      font-size: $font-size-sm;
      font-weight: 600;
    }
  }
  
  .ai-result {
    border-left: 3px solid $dark-accent;
    background-color: rgba($dark-accent, 0.05);
    
    [dir="rtl"] & {
      border-left: none;
      border-right: 3px solid $dark-accent;
    }
    
    .result-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $spacing-sm;
      
      .result-score {
        font-size: $font-size-xs;
        color: $dark-text-secondary;
      }
    }
  }
}

.no-results-hint {
  font-size: $font-size-sm;
  margin-top: $spacing-xs;
}

// Light theme overrides
.theme-light .search-container {
  background-color: $light-primary;
}

.theme-light .search-header {
  border-bottom-color: $light-border;
}

.theme-light .search-input {
  background-color: $light-background;
  border-color: $light-border;
  color: $light-text;
  
  &:focus {
    border-color: $light-accent;
  }
}

.theme-light .search-icon,
.theme-light .close-button,
.theme-light .clear-button {
  color: $light-text-secondary;
  
  &:hover {
    color: $light-accent;
  }
}

.theme-light .section-title {
  color: $light-text-secondary;
}

.theme-light .search-tag {
  background-color: $light-background;
  border-color: $light-border;
  color: $light-text;
  
  &:hover {
    background-color: rgba($light-accent, 0.1);
    border-color: $light-accent;
    color: $light-accent;
  }
}

.theme-light .result-item {
  background-color: $light-background;
  
  &:hover {
    background-color: darken($light-background, 2%);
  }
}

.theme-light .result-title {
  color: $light-text;
}

.theme-light .result-preview {
  color: $light-text-secondary;
}

.theme-light .ai-results .ai-header {
  border-bottom-color: $light-border;
  h3 { color: $light-text; }
  .confidence-badge { background-color: rgba($light-accent, 0.1); color: $light-accent; }
}

.theme-light .ai-results .ai-result {
  background-color: rgba($light-accent, 0.05);
  border-color: $light-accent;
}

// Responsive adjustments
@media (max-width: $breakpoint-mobile) {
  .search-modal {
    padding-top: 15%;
  }
  
  .search-container {
    width: 95%;
  }
}
</style>