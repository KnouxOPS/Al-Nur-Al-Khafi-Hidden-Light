<template>
  <article 
    class="content-card" 
    :class="[`card-${variant}`, { 'loading': isLoading }]"
    @click="handleClick"
    role="button"
    tabindex="0"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div v-if="isLoading" class="card-loading" aria-hidden="true">
      <div class="loading-skeleton"></div>
    </div>
    
    <template v-else>
      <!-- Card Image/Header -->
      <div v-if="image || icon" class="card-media">
        <img v-if="image" :src="image" :alt="title" class="card-image" loading="lazy" />
        <div v-else-if="icon" class="card-icon" :class="iconClass" aria-hidden="true">
          <component :is="iconComponent" class="icon" />
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <div v-if="category || date" class="card-meta">
          <span v-if="category" class="card-category">{{ category }}</span>
          <span v-if="date" class="card-date">{{ formatDate(date) }}</span>
        </div>

        <h3 class="card-title" :class="{ 'truncate': truncateTitle }">
          {{ title }}
        </h3>

        <p v-if="description" class="card-description" :class="{ 'truncate': truncateDescription }">
          {{ truncateText(description, descriptionMaxLength) }}
        </p>

        <div v-if="stats" class="card-stats">
          <div v-for="(stat, index) in stats" :key="index" class="stat-item">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>

        <div v-if="tags && tags.length > 0" class="card-tags">
          <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- Card Actions -->
      <div v-if="$slots.actions || showDefaultActions" class="card-actions">
        <slot name="actions">
          <button v-if="showBookmark" @click.stop="toggleBookmark" class="action-button" :class="{ 'bookmarked': isBookmarked }" 
                  :aria-label="isBookmarked ? t('common.bookmarked') : t('common.bookmark')">
            <svg v-if="!isBookmarked" class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else class="icon filled" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
            </svg>
          </button>
          
          <button v-if="showShare" @click.stop="shareContent" class="action-button" :aria-label="t('common.share')">
            <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </slot>
      </div>
    </template>
  </article>
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
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  date: {
    type: [String, Date],
    default: ''
  },
  stats: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  },
  variant: {
    type: String,
    default: 'default', // default, compact, featured, horizontal
    validator: (value) => ['default', 'compact', 'featured', 'horizontal'].includes(value)
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  truncateTitle: {
    type: Boolean,
    default: true
  },
  truncateDescription: {
    type: Boolean,
    default: true
  },
  descriptionMaxLength: {
    type: Number,
    default: 120
  },
  showBookmark: {
    type: Boolean,
    default: true
  },
  showShare: {
    type: Boolean,
    default: true
  },
  showDefaultActions: {
    type: Boolean,
    default: false
  },
  bookmarked: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['bookmark', 'share', 'click']);

// State
const isBookmarked = ref(props.bookmarked);

// Computed
const iconComponent = computed(() => {
  if (!props.icon) return null;
  
  // Dynamic component based on icon name
  const iconMap = {
    biography: 'BiographyIcon',
    hadith: 'HadithIcon',
    companion: 'CompanionIcon',
    battle: 'BattleIcon',
    wisdom: 'WisdomIcon'
  };
  
  return iconMap[props.icon] || 'DefaultIcon';
});

const iconClass = computed(() => {
  return `icon-${props.icon || 'default'}`;
});

// Methods
const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  emit('bookmark', isBookmarked.value);
};

const shareContent = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: props.title,
        text: props.description,
        url: window.location.href
      });
    } else {
      // Fallback to copy URL
      await navigator.clipboard.writeText(window.location.href);
      // Show success message (would need toast service)
      console.log(t('common.copied'));
    }
  } catch (error) {
    console.error('Share failed:', error);
  }
  
  emit('share');
};

// Click handler
const handleClick = () => {
  emit('click');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.content-card {
  background-color: $dark-primary;
  border: 1px solid $dark-border;
  border-radius: $border-radius-lg;
  overflow: hidden;
  transition: all $duration-normal $ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
    border-color: rgba($dark-accent, 0.3);
  }
  
  &:focus-visible {
    outline: 2px solid $dark-accent;
    outline-offset: 2px;
  }
  
  &.loading {
    pointer-events: none;
  }
  
  // Compact variant
  &.card-compact {
    .card-content {
      padding: $spacing-md;
    }
    
    .card-title {
      font-size: $font-size-md;
    }
    
    .card-description {
      font-size: $font-size-sm;
    }
  }
  
  // Featured variant
  &.card-featured {
    .card-media {
      height: 200px;
    }
    
    .card-title {
      font-size: $font-size-xl;
    }
  }
  
  // Horizontal variant
  &.card-horizontal {
    flex-direction: row;
    
    .card-media {
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }
    
    .card-content {
      flex: 1;
    }
    
    @media (max-width: $breakpoint-mobile) {
      flex-direction: column;
      
      .card-media {
        width: 100%;
        height: 160px;
      }
    }
  }
}

.card-loading {
  .loading-skeleton {
    height: 200px;
    background: linear-gradient(90deg, $dark-border 25%, transparent 50%, $dark-border 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.card-media {
  position: relative;
  overflow: hidden;
  
  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $duration-normal $ease-in-out;
  }
  
  .card-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba($dark-accent, 0.1);
    
    .icon {
      width: 48px;
      height: 48px;
      stroke: $dark-accent;
      fill: none;
      stroke-width: 2;
    }
    
    &.icon-default {
      background: linear-gradient(135deg, $dark-accent, $particle-emerald);
      
      .icon {
        stroke: $dark-primary;
        fill: $dark-primary;
      }
    }
  }
}

.card-content {
  padding: $spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xs;
  
  .card-category {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $dark-accent;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .card-date {
    font-size: $font-size-xs;
    color: $dark-text-secondary;
  }
}

.card-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $dark-text;
  margin: 0 0 $spacing-xs 0;
  line-height: 1.3;
  
  &.truncate {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.card-description {
  font-size: $font-size-sm;
  color: $dark-text-secondary;
  line-height: 1.5;
  margin: 0 0 $spacing-sm 0;
  
  &.truncate {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.card-stats {
  display: flex;
  gap: $spacing-lg;
  margin: $spacing-sm 0;
  
  .stat-item {
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

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-top: auto;
  
  .tag {
    font-size: $font-size-xs;
    background-color: rgba($dark-accent, 0.1);
    color: $dark-accent;
    padding: 2px $spacing-xs;
    border-radius: $border-radius-sm;
  }
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 $spacing-lg $spacing-lg;
  gap: $spacing-sm;
  
  .action-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid $dark-border;
    border-radius: $border-radius-md;
    color: $dark-text-secondary;
    cursor: pointer;
    transition: all $duration-fast $ease-in-out;
    
    &:hover {
      background-color: rgba($dark-accent, 0.1);
      border-color: $dark-accent;
      color: $dark-accent;
    }
    
    &:focus-visible {
      outline: 2px solid $dark-accent;
      outline-offset: 2px;
    }
    
    &.bookmarked {
      color: $dark-accent;
      border-color: $dark-accent;
      background-color: rgba($dark-accent, 0.1);
    }
    
    .icon {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      
      &.filled {
        fill: currentColor;
      }
    }
  }
}

// Light theme overrides
.theme-light .content-card {
  background-color: $light-primary;
  border-color: $light-border;
  
  &:hover {
    border-color: rgba($light-accent, 0.3);
  }
  
  .card-title {
    color: $light-text;
  }
  
  .card-description,
  .card-date,
  .stat-label {
    color: $light-text-secondary;
  }
  
  .card-category,
  .stat-value,
  .tag {
    color: $light-accent;
  }
  
  .card-icon {
    background-color: rgba($light-accent, 0.1);
    
    .icon {
      stroke: $light-accent;
    }
    
    &.icon-default {
      background: linear-gradient(135deg, $light-accent, $light-secondary);
      
      .icon {
        stroke: $light-primary;
        fill: $light-primary;
      }
    }
  }
  
  .card-meta .card-category {
    color: $light-accent;
  }
  
  .action-button {
    border-color: $light-border;
    color: $light-text-secondary;
    
    &:hover {
      background-color: rgba($light-accent, 0.1);
      border-color: $light-accent;
      color: $light-accent;
    }
    
    &.bookmarked {
      color: $light-accent;
      border-color: $light-accent;
      background-color: rgba($light-accent, 0.1);
    }
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-mobile) {
  .content-card {
    &.card-featured {
      .card-media {
        height: 160px;
      }
      
      .card-title {
        font-size: $font-size-lg;
      }
    }
    
    .card-content {
      padding: $spacing-md;
    }
    
    .card-title {
      font-size: $font-size-md;
    }
    
    .card-description {
      font-size: $font-size-sm;
    }
    
    .card-actions {
      padding: 0 $spacing-md $spacing-md;
    }
  }
}
</style>