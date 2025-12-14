<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="search-modal" @click="handleBackdropClick">
        <div class="search-container" @click.stop>
          <!-- Search Header -->
          <div class="search-header">
            <div class="search-input-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input
                ref="searchInput"
                v-model="searchQuery"
                :placeholder="t('common.search') + '...'"
                class="search-input"
                @input="debouncedSearch"
                @keydown.enter="handleEnter"
                @keydown.esc="closeModal"
                autocomplete="off"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-button" :aria-label="t('common.close')">
                <span class="icon-text">✕</span>
              </button>
            </div>
            
            <button @click="closeModal" class="close-button" :aria-label="t('common.close')">
              <span class="btn-text">{{ t('common.close') }}</span>
            </button>
          </div>

          <!-- Recent Searches -->
          <div v-if="!searchQuery && recentSearches.length > 0" class="recent-searches">
            <h3 class="section-title">{{ t('nav.search') }} {{ t('common.recent') || 'Recent' }}</h3>
            <div class="search-tags">
              <button
                v-for="(search, index) in recentSearches"
                :key="index"
                @click="selectRecentSearch(search)"
                class="search-tag"
              >
                {{ search }}
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-else-if="searchQuery" class="search-results">
            <div v-if="isLoading" class="loading-results">
              <div class="spinner"></div>
              <p>{{ t('common.loading') }}</p>
            </div>
            
            <div v-else-if="searchResults.length > 0" class="results-list">
              <div
                v-for="result in searchResults"
                :key="result.id"
                class="result-item"
                @click="openResult(result)"
              >
                <div class="result-icon">
                  <span v-if="result.type === 'biography'">📖</span>
                  <span v-else-if="result.type === 'hadith'">📜</span>
                  <span v-else-if="result.type === 'companion'">👥</span>
                  <span v-else>🔍</span>
                </div>
                <div class="result-content">
                  <h4 class="result-title">{{ result.title }}</h4>
                  <p class="result-preview">{{ truncateText(result.preview, 60) }}</p>
                  <span class="result-type">{{ t(`nav.${result.type}`) || result.type }}</span>
                </div>
              </div>
            </div>
            
            <div v-else class="no-results">
              <p>{{ t('common.error') ? t('messages.noResults') : 'No results found' }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash-es';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const { t } = useI18n();
const router = useRouter();

const searchInput = ref(null);
const searchQuery = ref('');
const isLoading = ref(false);
const searchResults = ref([]);
const recentSearches = ref(JSON.parse(localStorage.getItem('recentSearches') || '[]'));

// Mock search function (replace with real API/Index)
const performSearch = async (query) => {
  isLoading.value = true;
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock results logic
  const mockData = [
    { id: 1, type: 'biography', title: 'The Year of Elephant', preview: 'Birth of Prophet Muhammad ﷺ in Mecca...', path: '/biography' },
    { id: 2, type: 'hadith', title: 'Actions are by intentions', preview: 'Sahih Bukhari, Hadith 1. The Prophet ﷺ said...', path: '/hadith' },
    { id: 3, type: 'companion', title: 'Abu Bakr As-Siddiq', preview: 'First Caliph of Islam and closest friend...', path: '/companions' },
    { id: 4, type: 'battles', title: 'Battle of Badr', preview: 'The first major battle between Muslims and Quraysh...', path: '/battles' },
    { id: 5, type: 'wisdom', title: 'Kindness to animals', preview: 'Fear Allah in these mute animals...', path: '/wisdom' }
  ];
  
  searchResults.value = mockData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.preview.toLowerCase().includes(query.toLowerCase())
  );
  
  isLoading.value = false;
};

const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim()) {
    performSearch(searchQuery.value);
  } else {
    searchResults.value = [];
  }
}, 300);

const handleEnter = () => {
  if (searchResults.value.length > 0) {
    openResult(searchResults.value[0]);
  }
};

const openResult = (result) => {
  addToRecent(searchQuery.value);
  closeModal();
  router.push(result.path);
};

const selectRecentSearch = (term) => {
  searchQuery.value = term;
  performSearch(term);
};

const addToRecent = (term) => {
  if (!term) return;
  const newRecent = [term, ...recentSearches.value.filter(s => s !== term)].slice(0, 5);
  recentSearches.value = newRecent;
  localStorage.setItem('recentSearches', JSON.stringify(newRecent));
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  searchInput.value?.focus();
};

const closeModal = () => {
  emit('close');
  searchQuery.value = '';
  searchResults.value = [];
};

const handleBackdropClick = () => {
  closeModal();
};

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Focus input when opened
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      searchInput.value?.focus();
    });
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
}

.search-container {
  width: 100%;
  max-width: 600px;
  background-color: $dark-primary;
  border-radius: $border-radius-lg;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  border: 1px solid $dark-border;
  overflow: hidden;
  margin: 0 $spacing-md;
  
  .theme-light & {
    background-color: $light-primary;
    border-color: $light-border;
  }
}

.search-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border-bottom: 1px solid rgba($dark-border, 0.5);
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  background-color: rgba($dark-secondary, 0.5);
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  border: 1px solid transparent;
  transition: border-color 0.3s;
  
  &:focus-within {
    border-color: $dark-accent;
  }
  
  .theme-light & {
    background-color: rgba($light-secondary, 0.5);
  }
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  color: $dark-text;
  font-size: 1.1rem;
  outline: none;
  
  .theme-light & {
    color: $light-text;
  }
  
  &::placeholder {
    color: $dark-text-secondary;
  }
}

.search-icon {
  width: 20px;
  height: 20px;
  color: $dark-text-secondary;
}

.close-button, .clear-button {
  background: none;
  border: none;
  cursor: pointer;
  color: $dark-text-secondary;
  font-weight: 500;
  
  &:hover {
    color: $dark-accent;
  }
}

.recent-searches, .search-results {
  padding: $spacing-md;
  max-height: 400px;
  overflow-y: auto;
}

.section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: $dark-text-secondary;
  margin-bottom: $spacing-md;
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.search-tag {
  background-color: rgba($dark-secondary, 0.6);
  color: $dark-text;
  border: 1px solid rgba($dark-border, 0.5);
  padding: 6px 14px;
  border-radius: $border-radius-pill;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: $dark-accent;
    color: $dark-accent;
    background-color: rgba($dark-accent, 0.1);
  }
}

.result-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid rgba($dark-border, 0.3);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba($dark-secondary, 0.6);
  }
}

.result-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba($dark-accent, 0.1);
  border-radius: 50%;
}

.result-content {
  flex: 1;
}

.result-title {
  font-size: 1rem;
  color: $dark-accent;
  margin: 0 0 4px 0;
}

.result-preview {
  font-size: 0.9rem;
  color: $dark-text-secondary;
  margin: 0 0 4px 0;
}

.result-type {
  font-size: 0.75rem;
  color: $dark-text-secondary;
  text-transform: uppercase;
  opacity: 0.7;
}

.loading-results, .no-results {
  text-align: center;
  padding: $spacing-lg;
  color: $dark-text-secondary;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba($dark-accent, 0.3);
  border-top-color: $dark-accent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto $spacing-sm;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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