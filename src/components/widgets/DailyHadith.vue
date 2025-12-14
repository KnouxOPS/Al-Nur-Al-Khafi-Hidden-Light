<template>
  <div class="daily-hadith-widget" v-if="hadith">
    <div class="widget-header">
      <div class="icon-wrapper">
        <span class="icon">✨</span>
      </div>
      <h3>{{ t('dailyHadith') }}</h3>
    </div>
    
    <div class="widget-content">
      <blockquote class="hadith-text">
        "{{ localizedText }}"
      </blockquote>
      <div class="hadith-source">
        — {{ localizedSource }}
      </div>
    </div>

    <div class="widget-actions">
      <button @click="shareHadith" class="share-btn" :aria-label="t('common.share')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>{{ t('common.share') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useMainStore();

const hadith = computed(() => store.content.dailyHadith);
const currentLang = computed(() => store.preferences.language);

const localizedText = computed(() => {
  if (!hadith.value) return '';
  return currentLang.value === 'ar' ? hadith.value.text : (hadith.value.textEn || hadith.value.text);
});

const localizedSource = computed(() => {
  if (!hadith.value) return '';
  return currentLang.value === 'ar' ? hadith.value.source : (hadith.value.sourceEn || hadith.value.source);
});

const shareHadith = async () => {
  if (!hadith.value) return;
  
  const shareData = {
    title: t('dailyHadith'),
    text: `"${localizedText.value}"\n— ${localizedSource.value}`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Share failed:', err);
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareData.text);
      // Ideally show a toast here, using console for now
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.daily-hadith-widget {
  background: rgba($dark-secondary, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($dark-accent, 0.2);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform $duration-normal;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &:hover {
    border-color: rgba($dark-accent, 0.4);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, transparent, $dark-accent, transparent);
  }
  
  .theme-light & {
    background: rgba($light-secondary, 0.1);
    border-color: rgba($light-accent, 0.3);
  }
}

.widget-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;

  h3 {
    font-family: 'Amiri', serif;
    font-size: $font-size-xl;
    color: $dark-accent;
    margin: 0;
  }
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba($dark-accent, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon {
    font-size: 1.2rem;
  }
}

.widget-content {
  position: relative;
}

.hadith-text {
  font-family: 'Amiri', serif;
  font-size: $font-size-xl;
  line-height: 1.8;
  color: $dark-text;
  margin: 0 0 $spacing-md 0;
  font-style: normal;
  
  .theme-light & {
    color: $light-text;
  }
}

.hadith-source {
  font-size: $font-size-sm;
  color: $dark-text-secondary;
  font-weight: 500;
  
  .theme-light & {
    color: $light-text-secondary;
  }
}

.widget-actions {
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba($dark-border, 0.5);
  padding-top: $spacing-md;
  
  .theme-light & {
    border-color: rgba($light-border, 0.5);
  }
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba($dark-text, 0.2);
  color: $dark-text-secondary;
  padding: 8px 16px;
  border-radius: $border-radius-pill;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: $font-size-sm;

  &:hover {
    background: rgba($dark-accent, 0.1);
    color: $dark-accent;
    border-color: $dark-accent;
  }

  .theme-light & {
    border-color: rgba($light-text, 0.2);
    color: $light-text-secondary;
    
    &:hover {
      background: rgba($light-accent, 0.1);
      color: $light-accent;
      border-color: $light-accent;
    }
  }
}
</style>