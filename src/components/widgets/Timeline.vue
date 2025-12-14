<template>
  <div class="timeline" :class="`timeline-${variant}`">
    <div v-if="title" class="timeline-header">
      <h2 class="timeline-title">{{ title }}</h2>
      <div v-if="period" class="timeline-period">{{ period }}</div>
    </div>

    <div class="timeline-items" role="list">
      <div
        v-for="(item, index) in items"
        :key="item.id || index"
        class="timeline-item"
        :class="{ 'active': isActiveItem(item), 'completed': isCompletedItem(item) }"
        @click="selectItem(item)"
        role="button"
        tabindex="0"
        @keydown.enter="selectItem(item)"
        @keydown.space.prevent="selectItem(item)"
        :aria-current="isActiveItem(item) ? 'step' : undefined"
        :aria-label="`${item.title}, ${formatDate(item.date, 'short')}`"
      >
        <!-- Timeline connector -->
        <div v-if="index < items.length - 1" class="timeline-connector" aria-hidden="true"></div>

        <!-- Timeline marker -->
        <div class="timeline-marker" aria-hidden="true">
          <div class="marker-dot"></div>
          <div v-if="item.date" class="marker-date">{{ formatDate(item.date, 'short') }}</div>
        </div>

        <!-- Timeline content -->
        <div class="timeline-content">
          <div class="content-header">
            <h3 class="content-title">{{ item.title }}</h3>
            <div v-if="item.category" class="content-category">{{ item.category }}</div>
          </div>
          
          <p v-if="item.description" class="content-description">
            {{ truncateText(item.description, descriptionLimit) }}
          </p>
          
          <div v-if="item.stats" class="content-stats">
            <div v-for="(stat, statIndex) in item.stats" :key="statIndex" class="stat">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
          
          <div v-if="item.tags && item.tags.length" class="content-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation controls -->
    <div v-if="showNavigation" class="timeline-navigation">
      <button 
        @click="previousItem" 
        :disabled="!hasPreviousItem"
        class="nav-button"
        :aria-label="t('common.previous') || 'Previous Item'"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="pagination-info" aria-live="polite">
        {{ currentIndex + 1 }} / {{ items.length }}
      </div>
      
      <button 
        @click="nextItem" 
        :disabled="!hasNextItem"
        class="nav-button"
        :aria-label="t('common.next') || 'Next Item'"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDate, truncateText } from '../../utils/helpers';

const { t } = useI18n();

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  period: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => [],
    required: true
  },
  variant: {
    type: String,
    default: 'vertical', // vertical, horizontal, compact
    validator: (value) => ['vertical', 'horizontal', 'compact'].includes(value)
  },
  selectedItem: {
    type: [Object, Number, String],
    default: null
  },
  showNavigation: {
    type: Boolean,
    default: false
  },
  descriptionLimit: {
    type: Number,
    default: 150
  },
  dateFormat: {
    type: String,
    default: 'long'
  }
});

// Emits
const emit = defineEmits(['update:selectedItem', 'itemSelect', 'navigate']);

// State
const currentIndex = ref(0);

// Computed
const hasPreviousItem = computed(() => currentIndex.value > 0);
const hasNextItem = computed(() => currentIndex.value < props.items.length - 1);

const isActiveItem = (item) => {
  if (!props.selectedItem) return false;
  return props.selectedItem === item || props.selectedItem.id === item.id;
};

const isCompletedItem = (item) => {
  const itemIndex = props.items.findIndex(i => i.id === item.id);
  return itemIndex < currentIndex.value;
};

// Methods
const selectItem = (item) => {
  const index = props.items.findIndex(i => i.id === item.id);
  if (index !== -1) {
    currentIndex.value = index;
  }
  emit('update:selectedItem', item);
  emit('itemSelect', item);
};

const previousItem = () => {
  if (hasPreviousItem.value) {
    currentIndex.value--;
    const item = props.items[currentIndex.value];
    emit('update:selectedItem', item);
    emit('navigate', { direction: 'previous', item });
  }
};

const nextItem = () => {
  if (hasNextItem.value) {
    currentIndex.value++;
    const item = props.items[currentIndex.value];
    emit('update:selectedItem', item);
    emit('navigate', { direction: 'next', item });
  }
};

const formatDate = (date, format = props.dateFormat) => {
  if (!date) return '';
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' });
  }
  
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.timeline {
  position: relative;
}

.timeline-header {
  margin-bottom: $spacing-xl;
  text-align: center;
  
  .timeline-title {
    font-size: $font-size-xxl;
    font-weight: 700;
    color: $dark-text;
    margin: 0 0 $spacing-sm 0;
  }
  
  .timeline-period {
    font-size: $font-size-md;
    color: $dark-accent;
    font-weight: 500;
  }
}

.timeline-items {
  position: relative;
}

.timeline-item {
  position: relative;
  padding: $spacing-lg 0 $spacing-lg $spacing-xl;
  cursor: pointer;
  transition: all $duration-normal $ease-in-out;
  outline: none;
  
  &:hover {
    background-color: rgba($dark-accent, 0.05);
  }
  
  &:focus-visible {
    background-color: rgba($dark-accent, 0.08);
    box-shadow: inset 2px 0 0 0 $dark-accent;
  }
  
  &.active {
    background-color: rgba($dark-accent, 0.1);
    
    .marker-dot {
      background-color: $dark-accent;
      border-color: $dark-accent;
      transform: scale(1.2);
    }
    
    .content-title {
      color: $dark-accent;
    }
  }
  
  &.completed {
    .marker-dot {
      background-color: $dark-accent;
    }
  }
}

.timeline-connector {
  position: absolute;
  top: 32px;
  left: 16px;
  width: 2px;
  height: calc(100% + 20px);
  background-color: $dark-border;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  
  .marker-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: $dark-primary;
    border: 3px solid $dark-border;
    transition: all $duration-fast $ease-in-out;
  }
  
  .marker-date {
    font-size: $font-size-xs;
    color: $dark-text-secondary;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
}

.timeline-content {
  .content-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $spacing-md;
    margin-bottom: $spacing-sm;
  }
  
  .content-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $dark-text;
    margin: 0;
    flex: 1;
  }
  
  .content-category {
    font-size: $font-size-xs;
    color: $dark-accent;
    background-color: rgba($dark-accent, 0.1);
    padding: 2px $spacing-xs;
    border-radius: $border-radius-sm;
    white-space: nowrap;
  }
  
  .content-description {
    font-size: $font-size-sm;
    color: $dark-text-secondary;
    line-height: 1.6;
    margin: 0 0 $spacing-sm 0;
  }
  
  .content-stats {
    display: flex;
    gap: $spacing-lg;
    margin: $spacing-sm 0;
    
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-value {
        font-size: $font-size-md;
        font-weight: 700;
        color: $dark-accent;
      }
      
      .stat-label {
        font-size: $font-size-xs;
        color: $dark-text-secondary;
      }
    }
  }
  
  .content-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    
    .tag {
      font-size: $font-size-xs;
      background-color: rgba($dark-accent, 0.1);
      color: $dark-accent;
      padding: 2px $spacing-xs;
      border-radius: $border-radius-sm;
    }
  }
}

.timeline-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
  margin-top: $spacing-xl;
  padding: $spacing-md;
  
  .nav-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid $dark-border;
    border-radius: 50%;
    color: $dark-text;
    cursor: pointer;
    transition: all $duration-fast $ease-in-out;
    
    &:hover:not(:disabled) {
      background-color: rgba($dark-accent, 0.1);
      border-color: $dark-accent;
      color: $dark-accent;
    }
    
    &:focus-visible {
      outline: 2px solid $dark-accent;
      outline-offset: 2px;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .icon {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
    }
  }
  
  .pagination-info {
    font-size: $font-size-sm;
    color: $dark-text-secondary;
    font-weight: 500;
  }
}

// Horizontal timeline variant
.timeline-horizontal {
  .timeline-items {
    display: flex;
    overflow-x: auto;
    gap: $spacing-xl;
    padding: $spacing-md 0;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: $dark-border;
      border-radius: $border-radius-sm;
    }
    
    &::-webkit-scrollbar-thumb {
      background: $dark-accent;
      border-radius: $border-radius-sm;
    }
  }
  
  .timeline-item {
    flex: 0 0 auto;
    min-width: 250px;
    padding: $spacing-lg;
    border: 1px solid $dark-border;
    border-radius: $border-radius-md;
    
    .timeline-marker {
      position: static;
      flex-direction: row;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;
      
      .marker-date {
        writing-mode: horizontal-tb;
      }
    }
    
    .timeline-connector {
      display: none;
    }
  }
}

// Compact timeline variant
.timeline-compact {
  .timeline-item {
    padding: $spacing-md 0 $spacing-md $spacing-lg;
  }
  
  .timeline-marker {
    top: $spacing-md;
  }
  
  .content-title {
    font-size: $font-size-md;
  }
  
  .content-description {
    font-size: $font-size-xs;
  }
}

// Light theme overrides
.theme-light .timeline-header {
  .timeline-title {
    color: $light-text;
  }
  
  .timeline-period {
    color: $light-accent;
  }
}

.theme-light .timeline-item {
  &:hover {
    background-color: rgba($light-accent, 0.05);
  }
  
  &:focus-visible {
    background-color: rgba($light-accent, 0.08);
    box-shadow: inset 2px 0 0 0 $light-accent;
  }
  
  &.active {
    background-color: rgba($light-accent, 0.1);
    
    .marker-dot {
      background-color: $light-accent;
      border-color: $light-accent;
    }
    
    .content-title {
      color: $light-accent;
    }
  }
  
  &.completed {
    .marker-dot {
      background-color: $light-accent;
    }
  }
}

.theme-light .timeline-connector {
  background-color: $light-border;
}

.theme-light .timeline-marker {
  .marker-dot {
    background-color: $light-primary;
    border-color: $light-border;
  }
  
  .marker-date {
    color: $light-text-secondary;
  }
}

.theme-light .content-title {
  color: $light-text;
}

.theme-light .content-category,
.theme-light .stat-value,
.theme-light .tag {
  color: $light-accent;
}

.theme-light .content-description,
.theme-light .stat-label,
.theme-light .pagination-info {
  color: $light-text-secondary;
}

.theme-light .nav-button {
  border-color: $light-border;
  color: $light-text;
  
  &:hover:not(:disabled) {
    background-color: rgba($light-accent, 0.1);
    border-color: $light-accent;
    color: $light-accent;
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-mobile) {
  .timeline-header {
    margin-bottom: $spacing-lg;
    
    .timeline-title {
      font-size: $font-size-xl;
    }
    
    .timeline-period {
      font-size: $font-size-sm;
    }
  }
  
  .timeline-item {
    padding: $spacing-md 0 $spacing-md $spacing-lg;
  }
  
  .timeline-marker {
    top: $spacing-md;
  }
  
  .content-header {
    flex-direction: column;
    gap: $spacing-xs;
  }
  
  .content-title {
    font-size: $font-size-md;
  }
  
  .content-description {
    font-size: $font-size-sm;
  }
  
  .content-stats {
    gap: $spacing-md;
    
    .stat-value {
      font-size: $font-size-sm;
    }
    
    .stat-label {
      font-size: $font-size-xs;
    }
  }
  
  .timeline-navigation {
    gap: $spacing-md;
  }
  
  .timeline-horizontal {
    .timeline-item {
      min-width: 200px;
      padding: $spacing-md;
    }
  }
}
</style>